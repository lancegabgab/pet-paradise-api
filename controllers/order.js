const orderService = require('../services/order');

const createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.user?.id);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    const status = error.message === 'No items in the cart' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user?.id);
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error retrieving user orders:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error retrieving all orders (admin):', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
};
