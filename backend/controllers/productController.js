const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['id', 'DESC']] });
    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).send({ success: false, message: 'Server error' });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, desc } = req.body;

    const parsedPrice = parseFloat(price) || 0;
    const parsedStock = parseInt(stock) || 0;
    const sku = `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const status = parsedStock > 5 ? "In Stock" : parsedStock > 0 ? "Low Stock" : "Out of Stock";

    const newProduct = await Product.create({
      sku,
      name,
      category: category || "General",
      price: parsedPrice,
      stock: parsedStock,
      status,
      desc: desc || `${name} - high quality ${category || 'general'} product.`,
    });

    res.status(201).send({
      success: true,
      data: newProduct,
      message: 'Product added successfully to MySQL database',
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).send({ success: false, message: 'Server error adding product to database' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ success: false, message: 'Product ID is required' });
    }

    // Extract numeric ID if string contains prefix like 'PROD-1' or '#PROD-1'
    const numericId = typeof id === 'string' && id.includes('-') ? id.split('-').pop() : id;

    const deletedCount = await Product.destroy({
      where: { id: numericId }
    });

    res.status(200).send({
      success: true,
      deletedCount,
      message: `Product ${id} deleted successfully from MySQL database`,
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).send({ success: false, message: 'Server error deleting product from database' });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
};
