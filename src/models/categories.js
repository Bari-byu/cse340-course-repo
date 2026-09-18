
import db from './db.js';

const getAllCategories = async () => {
    const query = `SELECT category_id, category_name
    FROM public.categories`;
    const result = await db.query(query);
    return result.rows;
};

// Retrieves a single category by its ID.
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories
        WHERE category_id = $1`;
    const result = await db.query(query, [categoryId]);
    return result.rows[0] || null;
};

// Retrieves all categories associated with a given service project.
const getCategoriesForProject = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public.categories c
        JOIN public.project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name`;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Retrieves all service projects associated with a given category.
const getProjectsForCategory = async (categoryId) => {
    const query = `
        SELECT sp.project_id, sp.title
        FROM public.service_projects sp
        JOIN public.project_categories pc
            ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.title`;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesForProject, getProjectsForCategory };
