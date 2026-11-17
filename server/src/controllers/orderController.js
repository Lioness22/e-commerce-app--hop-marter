
import { createOrder,  getOrdersByUserId,  getOrderDetailsById } from '../models/orderModel.js';
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress, items } = req.body || {};
    if (
      typeof shippingAddress !== 'string' ||
      !shippingAddress.trim() ||
      shippingAddress.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid shipping address.'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.'
      });
    }

    if (items.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 50 different products allowed per order.'
      });
    }

    const productIds = new Set();

    for (const item of items) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cart item.'
        });
      }
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0 ||
        quantity > 100
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID or quantity.'
        });
      }
      if (productIds.has(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate products are not allowed.'
        });
      }

      productIds.add(productId);
    }
    const order = await createOrder(
      userId,
      shippingAddress.trim(),
      items
    );
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order
    });

  } catch (error) {
    console.error('Place order error:', error);
    if (
      error.message.includes('not found') ||
      error.message.includes('Insufficient stock')
    ) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Unable to place order.'
    });
  }
};

export const fetchMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await getOrdersByUserId(userId);
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch your orders.'
    });
  }
};

export const fetchOrderDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = Number(req.params.id);
    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.'
      });
    }
    const order = await getOrderDetailsById(orderId, userId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Fetch order details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch order details.'
    });
  }
};
