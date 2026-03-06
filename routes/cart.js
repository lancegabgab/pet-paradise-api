const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

router.get('/get-cart', verify, cartController.getUserCart);
router.post('/add-to-cart', verify, cartController.addToCart);
router.patch('/update-cart-quantity', verify, cartController.changeQuantity);
router.delete('/:productId/remove-from-cart', verify, cartController.removeProductFromCart);
router.delete('/clear-cart', verify, cartController.clearCartItems);

module.exports = router;

