const Product = require("../models/product.model");

const getAllProducts = async () => {
  const products = await Product.find({});
  return products.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    petType: product.petType,
    category: product.category
  }));
};

const getAllActiveProducts = async () => {
  const products = await Product.find({ isActive: true });
    return products.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    petType: product.petType,
    category: product.category
  }));
};

const createProduct = async (data) => {
  const newProduct = await Product.create(data);
  const { _id, name, description, price, petType, category } = newProduct;
  return {
    id: _id,
    name,
    description,
    price,
    petType,
    category
  };
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
