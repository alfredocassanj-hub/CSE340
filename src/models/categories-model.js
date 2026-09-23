const pool = require("../database/");

/* ***************************
 * Get all categories
 * ************************** */
async function getCategories() {
  const { rows } = await pool.query(
    "SELECT * FROM public.category ORDER BY category_name"
  );
  return rows;
}

/* ***************************
 * Get category by ID
 * ************************** */
async function getCategoryById(category_id) {
  const { rows } = await pool.query(
    "SELECT * FROM public.category WHERE category_id = $1",
    [category_id]
  );
  return rows[0];
}

/* ***************************
 * Add new category
 * ************************** */
async function addCategory(category_name) {
  const sql = `
    INSERT INTO public.category (category_name)
    VALUES ($1)
    RETURNING *
  `;

  const result = await pool.query(sql, [category_name]);
  return result.rows[0];
}

/* ***************************
 * Update category
 * ************************** */
async function updateCategory(category_id, category_name) {
  const sql = `
    UPDATE public.category
    SET category_name = $1
    WHERE category_id = $2
    RETURNING *
  `;

  const result = await pool.query(sql, [category_name, category_id]);
  return result.rows[0];
}

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
};