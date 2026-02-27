const Order = require('../models/order');
const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });
    
    if (!userCart || userCart.items.length === 0) {
      return res.status(404).send({ message: 'No items in the cart' });
    }

    // Create a new order document
    const newOrder = new Order({
      user: userId,
      productsOrdered: userCart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: userCart.total,
    });

    // Save the new order
    await newOrder.save();

    // Clear the user's cart
    userCart.items = [];
    userCart.total = 0;
    await userCart.save();

    return res.status(201).send({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error in creating order:', error);
    res.status(500).send({ error: 'Failed to create order', message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's orders
    const userOrders = await Order.find({ user: userId });

    res.status(200).send({ orders: userOrders });
  } catch (error) {
    console.error('Error in retrieving user orders:', error);
    res.status(500).send({ error: 'Failed to retrieve user orders', message: error.message });
  }
};

const getAllUsersOrders = async (req, res) => {
  try {
    // Find all orders (for admin)
    const allOrders = await Order.find({});

    res.status(200).send({ orders: allOrders });
  } catch (error) {
    console.error('Error in retrieving all orders (admin):', error);
    res.status(500).send({ error: 'Failed to retrieve all orders', message: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getAllUsersOrders };
