
import { getAdminDashboardStats,  getAllOrdersForAdmin,
    updateOrderStatus,getOrderDetailsForAdmin
} from '../models/orderModel.js';
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();
    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: stats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersForAdmin();
    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });

  } catch (error) {
    console.error('Admin orders error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

export const changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }
    const updatedOrder = await updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

export const getAdminOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderDetailsForAdmin(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      data: order
    });

  } catch (error) {
    console.error('Admin order details error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};


