const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/cart');

const createOrder = async (userId) => {
  if (!userId) throw new Error('Unauthorized');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userCart = await Cart.findOne({ userId })
      .populate('items.productId', 'name price')
      .session(session);

    if (!userCart || userCart.items.length === 0) {
      throw new Error('No items in the cart');
    }

    const orderItems = userCart.items.map(item => ({
      productId: item.productId?._id,
      name: item.productId?.name || 'Unknown',
      quantity: item.quantity,
      price: item.price || item.productId?.price || 0,
    }));

    const newOrder = new Order({
      user: userId,
      productsOrdered: orderItems,
      totalPrice: userCart.total,
    });

    await newOrder.save({ session });

    // Clear cart
    userCart.items = [];
    userCart.total = 0;
    await userCart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getUserOrders = async (userId) => {
  if (!userId) throw new Error('Unauthorized');
  return await Order.find({ user: userId })
    .populate('user', 'firstName lastName');
};

const getAllOrders = async () => {
  return await Order.find({})
    .populate('user', 'firstName lastName');
};

module.exports = { createOrder, getUserOrders, getAllOrders };



