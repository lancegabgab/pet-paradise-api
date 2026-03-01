const cartService = require("../services/cartService");

const getUserCart = async (req, res) => {
  try {
    const cart = await cartService.getUserCart(req.user.id);
    res.status(200).send({ cart });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await cartService.addToCart(
      req.user.id,
      productId,
      quantity
    );

    res.status(200).send({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const changeQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await cartService.changeQuantity(
      req.user.id,
      productId,
      quantity
    );

    res.status(200).send({
      message: "Quantity updated successfully",
      cart,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const cart = await cartService.removeProductFromCart(
      req.user.id,
      req.params.productId
    );

    res.status(200).send({
      message: "Product removed successfully",
      cart,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const clearCartItems = async (req, res) => {
  try {
    const cart = await cartService.clearCartItems(req.user.id);

    res.status(200).send({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  changeQuantity,
  removeProductFromCart,
  clearCartItems,
};