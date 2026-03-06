const productService = require("../services/products");

const getAllProduct = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getAllActiveProduct = async (req, res) => {
  try {
    const products = await productService.getAllActiveProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active products" });
  }
};

const addProduct = async (req, res) => {
  try {
    const savedProduct = await productService.createProduct(req.body);
    res.status(201).json(savedProduct);
  } catch (err) {
    if (err.message === "Product already exists")
      return res.status(409).json({ error: err.messag });
    res.status(500).json({ error: "Failed to create product" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.productId);
    if (!product)
      return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProductById(
      req.params.productId,
      req.body
    );
    if (!updated) 
      return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

const archiveProduct = async (req, res) => {
  try {
    const archived = await productService.archiveProductById(
      req.params.productId
    );
    if (!archived)
      return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product archived successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to archive product" });
  }
};

const activateProduct = async (req, res) => {
  try {
    const activated = await productService.activateProductById(
      req.params.productId
    );
    if (!activated) 
      return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product activated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to activate product" });
  }
};

module.exports = {
  getAllProduct,
  getAllActiveProduct,
  addProduct,
  getProduct,
  updateProduct,
  archiveProduct,
  activateProduct
};