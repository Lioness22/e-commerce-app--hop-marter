
import pool from '../config/db.js';

export const getAllProducts = async () => {
  const result = await pool.query(
    'SELECT * FROM products ORDER BY id ASC'
  );

  return result.rows;
};
