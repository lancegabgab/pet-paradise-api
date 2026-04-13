const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model"); 
const Product = require("../models/product.model");

const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return {
      cart: null,
      items: [],
    };
  }

  const items = await CartItem.find({ cartId: cart._id })
    .populate("productId", "name price");

  return {
    cart: {
      id: cart._id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    },
    items: items.map(item => ({
      id: item._id,
      cartId: item.cartId,
      quantity: item.quantity,
      price: item.price,
      product: item.productId
        ? {
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
          }
        : null,
    })),
  };
};

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  const existingItem = await CartItem.findOne({
    cartId: cart._id,
    productId,
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    await CartItem.create({
      cartId: cart._id,
      productId,
      quantity,
      price: product.price,
    });
  }

  const items = await CartItem.find({ cartId: cart._id })
    .populate("productId", "name price");

  return { cart, items };
};

const changeQuantity = async (userId, productId, newQuantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const cartItem = await CartItem.findOne({
    cartId: cart._id,
    productId,
  });

  if (!cartItem) throw new Error("Product not in cart");

  cartItem.quantity = newQuantity;
  await cartItem.save();

  const items = await CartItem.find({ cartId: cart._id }).populate(
    "productId",
    "name price"
  );

  return { cart, items };
};

const removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  await CartItem.findOneAndDelete({
    cartId: cart._id,
    productId,
  });

  const items = await CartItem.find({ cartId: cart._id }).populate(
    "productId",
    "name price"
  );

  return { cart, items };
};

const clearCartItems = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  await CartItem.deleteMany({ cartId: cart._id });

  const items = [];
  return { cart, items };
};

module.exports = {
  getUserCart,
  addToCart,
  changeQuantity,
  removeProductFromCart,
  clearCartItems,
};
