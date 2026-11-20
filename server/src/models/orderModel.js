
import pool from '../config/db.js';

export const createOrder = async (
  userId,
  shippingAddress,
  items
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let totalAmount = 0;
    const verifiedItems = [];

    // Validate products and stock using PostgreSQL
    for (const item of items) {
      const result = await client.query(
        `SELECT id, price, stock
         FROM products
         WHERE id = $1
         FOR UPDATE`,
        [item.productId]
      );

      if (result.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const product = result.rows[0];
      const quantity = Number(item.quantity);

      if (product.stock < quantity) {
        throw new Error(
          `Insufficient stock for product ${product.id}`
        );
      }

      const price = Number(product.price);
      totalAmount += price * quantity;

      verifiedItems.push({
        productId: product.id,
        quantity,
        price
      });
    }

    // Create order using database-calculated total
    const orderResult = await client.query(
      `INSERT INTO orders
       (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, totalAmount, shippingAddress]
    );

    const order = orderResult.rows[0];

    // Insert order items and update stock
    for (const item of verifiedItems) {
      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [
          order.id,
          item.productId,
          item.quantity,
          item.price
        ]
      );

      await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2`,
        [item.quantity, item.productId]
      );
    }

    await client.query('COMMIT');

    return order;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;

  } finally {
    client.release();
  }
};


export const getOrdersByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT
       o.id,
       o.total_amount,
       o.status,
       o.shipping_address,
       o.created_at,
       COUNT(oi.id)::INTEGER AS total_items
     FROM orders o
     LEFT JOIN order_items oi
       ON o.id = oi.order_id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [userId]
  );

  return result.rows;
};


export const getOrderDetailsById = async (orderId, userId) => {
  // Get order information
  const orderResult = await pool.query(
    `SELECT
       id,
       user_id,
       total_amount,
       status,
       shipping_address,
       created_at
     FROM orders
     WHERE id = $1 AND user_id = $2`,
    [orderId, userId]
  );
  if (orderResult.rows.length === 0) {
    return null;
  }
  const order = orderResult.rows[0];
  // Get products belonging to this order
  const itemsResult = await pool.query(
    `SELECT
       oi.product_id,
       p.name,
       p.image,
       oi.quantity,
       oi.price,
       (oi.quantity * oi.price) AS subtotal
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id ASC`,
    [orderId]
  );
  return {
    ...order,
    items: itemsResult.rows
  };
};

export const getAdminDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM orders)::INTEGER AS total_orders,
      (SELECT COALESCE(SUM(total_amount), 0)
       FROM orders
       WHERE status = 'delivered') AS total_sales,
      (SELECT COUNT(*)
       FROM orders
       WHERE status = 'pending')::INTEGER AS pending_orders,
      (SELECT COUNT(*)
       FROM users
       WHERE role = 'customer')::INTEGER AS total_customers,
      (SELECT COUNT(*)
       FROM products)::INTEGER AS total_products
  `);
  return result.rows[0];
};


export const getAllOrdersForAdmin = async () => {
  const result = await pool.query(`
    SELECT
      o.id,
      o.user_id,
      u.full_name AS customer_name,
      u.email AS customer_email,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.created_at,
      COUNT(oi.id)::INTEGER AS total_items
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id, u.id
    ORDER BY o.created_at DESC
  `);

  return result.rows;
};

export const updateOrderStatus = async (orderId, status) => {
  const result = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, orderId]
  );
  return result.rows[0] || null;
};

export const getOrderDetailsForAdmin = async (orderId) => {
  const orderResult = await pool.query(
    `SELECT
       o.id,
       o.user_id,
       u.full_name AS customer_name,
       u.email AS customer_email,
       o.total_amount,
       o.status,
       o.shipping_address,
       o.created_at
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.id = $1`,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }
  const order = orderResult.rows[0];
  const itemsResult = await pool.query(
    `SELECT
       oi.product_id,
       p.name AS product_name,
       p.image AS product_image,
       oi.quantity,
       oi.price,
       (oi.quantity * oi.price) AS subtotal
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id ASC`,
    [orderId]
  );
  return {
    ...order,
    items: itemsResult.rows
  };
};



