const cartService = require("../services/cart.service");

const getUserCart = async (req, res) => {
  try {
    const { cart, items } = await cartService.getUserCart(req.user.id);
    res.status(200).json({ 
      success: true,
      message: "Cart retrieved successfully",
      data: { cart, items },
    });
  } catch (error) {
    res.status(404).json({ 
      success: false,
      message: error.message 
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const { cart, items } = await cartService.addToCart(
      req.user.id,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: { cart, items },
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const changeQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const { cart, items } = await cartService.changeQuantity(
      req.user.id,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: { cart, items },
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { cart, items } = await cartService.removeProductFromCart(
      req.user.id,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Product removed successfully",
      data: { cart, items },
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const clearCartItems = async (req, res) => {
  try {
    const { cart, items } = await cartService.clearCartItems(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: { cart, items },
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  changeQuantity,
  removeProductFromCart,
  clearCartItems,
};
