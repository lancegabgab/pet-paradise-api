const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
  try {
    const newOrderData = await orderService.createOrder(req.user?.id);
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrderData
    });
  } catch (error) {
    console.error('Error creating order:', error);

    res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user?.id);
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error retrieving user orders:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error retrieving all orders (admin):', error);

    res.status(error.status || 500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders
};
