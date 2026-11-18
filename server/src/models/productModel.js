
import pool from '../config/db.js';

export const getAllProducts = async () => {
  const result = await pool.query(
    'SELECT * FROM products ORDER BY id ASC'
  );
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};
