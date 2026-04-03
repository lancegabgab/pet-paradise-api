const productService = require("../services/product.service");

const getAllProduct = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      success: true,
      message: "Fetched products successfully",
      data: products
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const getAllActiveProduct = async (req, res) => {
  try {
    const products = await productService.getAllActiveProducts();
    res.status(200).json({
      success: true,
      message: "Fetched products successfully",
      data: products
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const savedProduct = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product already exists"
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.productId);
    if (!product)
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    res.status(200).json({
      success: true,
      message: "Fetched product successfully",
      data: product
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProductById(
      req.params.productId,
      req.body
    );
    if (!updatedProduct) 
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    res.status(200).json({
      success: true,
      message: "Updated product successfully",
      data: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const archiveProduct = async (req, res) => {
  try {
    const archivedProduct = await productService.archiveProductById(
      req.params.productId
    );
    if (!archivedProduct)
      return res.status(404).json({ 
        success: false,
        message: "Product not found"
      });
    res.status(200).json({ 
      success: true,
      message: "Product archived successfully",
      data: archivedProduct
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

const activateProduct = async (req, res) => {
  try {
    const activatedProduct = await productService.activateProductById(
      req.params.productId
    );
    if (!activatedProduct) 
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    res.status(200).json({ 
      success: true,
      message: "Product activated successfully",
      data: activatedProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false, 
      message: "Internal server error" 
    });
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
