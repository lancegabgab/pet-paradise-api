const Cart = require("../models/cart");
const Product = require("../models/products"); // Add this line to import the Product model

const getUserCart = (req, res) => {
  const userId = req.user.id;

  Cart.findOne({ userId })
    .populate('items.productId', 'name price') // Populate product details in the items array
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: 'Cart not found for the user' });
      }

      res.status(200).send({ cart });
    })
    .catch((err) => {
      console.error('Error in getting user cart:', err);
      res.status(500).send({ error: 'Failed to get user cart' });
    });
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Retrieve product details
    const product = await Product.findById(productId);
    if (!product) {
      console.error('Product not found');
      return res.status(404).send({ error: 'Product not found' });
    }

    // Calculate subtotal
    const subtotal = product.price * quantity;

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({
        userId,
        items: [],
        total: 0,
      });
    }

    // Add a new item or update existing item
    const existingItem = userCart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal += subtotal;
    } else {
      userCart.items.push({
        productId,
        quantity,
        price: product.price, // Set the price here
        subtotal,
      });
    }

    // Recalculate the total in the cart
    userCart.total = userCart.items.reduce((acc, item) => acc + item.subtotal, 0);

    await userCart.save();

    return res.status(200).send({ message: 'Item added to cart successfully', cart: userCart });
  } catch (error) {
    console.error('Error in adding to cart:', error);
    res.status(500).send({ error: 'Failed to add item to cart' });
  }
};

const changeQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.body.productId;
    const newQuantity = req.body.quantity;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).send({ error: 'Cart not found for the user' });
    }

    // Find the item in the cart
    const cartItem = userCart.items.find((item) => item.productId === productId);

    if (!cartItem) {
      return res.status(404).send({ error: 'Product not found in the cart' });
    }

    // Update the quantity and recalculate subtotal
    cartItem.quantity = newQuantity;
    cartItem.subtotal = newQuantity * cartItem.price;

    // Recalculate total in the cart
    userCart.total = userCart.items.reduce((acc, item) => acc + item.subtotal, 0);

    // Save the updated cart
    await userCart.save();

    res.status(200).send({ message: 'Quantity updated successfully', cart: userCart });
  } catch (error) {
    console.error('Error in changing quantity:', error);
    res.status(500).send({ error: 'Failed to update quantity in cart', message: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).send({ error: 'Cart not found for the user' });
    }

    // Find the index of the item in the cart
    const itemIndex = userCart.items.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).send({ error: 'Product not found in the cart' });
    }

    // Remove the product from the items array
    userCart.items.splice(itemIndex, 1);

    // Recalculate total in the cart
    userCart.total = userCart.items.reduce((acc, item) => acc + item.subtotal, 0);

    // Save the updated cart
    await userCart.save();

    res.status(200).send({ message: 'Product removed from the cart successfully', cart: userCart });
  } catch (error) {
    console.error('Error in removing product from cart:', error);
    res.status(500).send({ error: 'Failed to remove product from cart', message: error.message });
  }
};

const clearCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).send({ error: 'Cart not found for the user' });
    }

    // Clear all items in the cart
    userCart.items = [];
    userCart.total = 0;

    // Save the updated cart
    const updatedCart = await userCart.save();

    res.status(200).send({ message: 'All cart items cleared successfully', cart: updatedCart });
  } catch (error) {
    console.error('Error in clearing cart items:', error);
    res.status(500).send({ error: 'Failed to clear cart items', message: error.message });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  changeQuantity,
  removeProductFromCart,
  clearCartItems
}

