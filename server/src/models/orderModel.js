
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
