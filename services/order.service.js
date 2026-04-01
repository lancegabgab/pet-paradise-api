const mongoose = require('mongoose');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');

const createOrder = async (userId) => {
  if (!userId) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart) {
      const err = new Error('Cart not found');
      err.status = 404;
      throw err;
    }

    const cartItems = await CartItem.find({ cartId: cart._id })
      .populate('productId', 'name price')
      .session(session);

    if (!cartItems.length) {
      const err = new Error('No items in the cart');
      err.status = 400;
      throw err;
    }

    let totalPrice = 0;

    const orderItemsData = cartItems.map(item => {
      const price = item.price || item.productId?.price || 0;
      totalPrice += price * item.quantity;

      return {
        orderId: null,
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price
      };
    });

    const [order] = await Order.create([{
      user: userId,
      totalPrice
    }], { session });
    
    const orderItems = orderItemsData.map(item => ({
      ...item,
      orderId: order._id
    }));

    await OrderItem.insertMany(orderItems, { session });
    await CartItem.deleteMany({ cartId: cart._id }, { session });
    await session.commitTransaction();
    session.endSession();

    return order;

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getUserOrders = async (userId) => {
  if (!userId) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderItem.find({ orderId: order._id })
        .populate('productId', 'name price');

      return {
        order,
        items
      };
    })
  );

  return ordersWithItems;
};

const getAllOrders = async () => {
  const orders = await Order.find({})
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderItem.find({ orderId: order._id })
        .populate('productId', 'name price image');

      return {
        order,
        items
      };
    })
  );

  return ordersWithItems;
};

module.exports = { createOrder, getUserOrders, getAllOrders };




