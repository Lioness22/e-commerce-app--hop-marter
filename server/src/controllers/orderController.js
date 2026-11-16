
import { createOrder } from '../models/orderModel.js';

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { shippingAddress, items } = req.body;

    // Validate shipping address
    if (
      typeof shippingAddress !== 'string' ||
      !shippingAddress.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required.'
      });
    }

    // Validate cart items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.'
      });
    }

    // Validate product IDs and quantities
    const productIds = new Set();

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID or quantity.'
        });
      }

      // Reject duplicate products
      if (productIds.has(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate products are not allowed.'
        });
      }

      productIds.add(productId);
    }

    // Create order using verified database prices
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
    console.error('Place order error:', error.message);

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
