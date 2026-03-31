const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return { cart: null, items: [] };
  }

  const items = await CartItem.find({ cartId: cart._id })
    .populate("productId", "name price");

  return { cart, items };
};


const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  let userCart = await Cart.findOne({ userId });

  if (!userCart) {
    userCart = new Cart({
      userId,
      items: [],
      total: 0,
    });
  }

  const existingItem = userCart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCart.items.push({
      productId,
      quantity,
      price: product.price,
    });
  }

  userCart.total = userCart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await userCart.save();
  return userCart;
};

const changeQuantity = async (userId, productId, newQuantity) => {
  const userCart = await Cart.findOne({ userId });

  if (!userCart) throw new Error("Cart not found");

  const cartItem = userCart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!cartItem) throw new Error("Product not in cart");

  cartItem.quantity = newQuantity;

  userCart.total = userCart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await userCart.save();
  return userCart;
};

const removeProductFromCart = async (userId, productId) => {
  const userCart = await Cart.findOne({ userId });

  if (!userCart) throw new Error("Cart not found");

  userCart.items = userCart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  userCart.total = userCart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await userCart.save();
  return userCart;
};

const clearCartItems = async (userId) => {
  const userCart = await Cart.findOne({ userId });

  if (!userCart) throw new Error("Cart not found");

  userCart.items = [];
  userCart.total = 0;

  await userCart.save();
  return userCart;
};

module.exports = {
  getUserCart,
  addToCart,
  changeQuantity,
  removeProductFromCart,
  clearCartItems,
};
