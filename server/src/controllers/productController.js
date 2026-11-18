
import {
  getAllProducts,
  getProductById
} from '../models/productModel.js';

export const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Fetch products error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Fetch product by ID error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details'
    });
  }
};
