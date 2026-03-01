const Product = require("../models/products");

const getAllProducts = async () => {
  return await Product.find({});
};

const getAllActiveProducts = async () => {
  return await Product.find({ isActive: true });
};

const createProduct = async (data) => {
  const existing = await Product.findOne({ name: data.name });
  if (existing) {
    throw new Error("Product already exists");
  }

  const newProduct = new Product(data);
  return await newProduct.save();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProductById = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const archiveProductById = async (id) => {
  return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const activateProductById = async (id) => {
  return await Product.findByIdAndUpdate(id, { isActive: true }, { new: true });
};

const searchByPriceRange = async (min, max) => {
  return await Product.find({
    price: { $gte: min, $lte: max },
  });
};

module.exports = {
  getAllProducts,
  getAllActiveProducts,
  createProduct,
  getProductById,
  updateProductById,
  archiveProductById,
  activateProductById,
  searchByPriceRange
};