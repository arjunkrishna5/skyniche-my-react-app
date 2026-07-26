const { getAllProducts, addProduct, deleteProduct } = require('../controllers/productController');

const productRoutes = [
  {
    method: "POST",
    url: "/webservices/products/get-all-products",
    handler: getAllProducts,
  },
  {
    method: "GET",
    url: "/webservices/products/get-all-products",
    handler: getAllProducts,
  },
  {
    method: "POST",
    url: "/webservices/products/add-product",
    handler: addProduct,
  },
  {
    method: "POST",
    url: "/webservices/products/delete-product",
    handler: deleteProduct,
  },
];

module.exports = productRoutes;
