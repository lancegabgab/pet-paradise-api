const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");

const auth = require("../auth");
const { verify, verifyAdmin } = auth;

router.post("/", verify, verifyAdmin, productController.addProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProduct);
router.get("/", productController.getAllActiveProduct);
router.get("/:productId", productController.getProduct);
router.put("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

module.exports = router; 