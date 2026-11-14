
import { getAllProducts } from '../models/productModel.js';

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
