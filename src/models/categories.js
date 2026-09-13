import db from './db.js'

export const getAllCategories = async () => {
  const query = `
    SELECT category_id, category_name
    FROM categories;
  `;

  const result = await db.query(query);
  return result.rows;
};