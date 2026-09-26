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

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

// Creates a new category and returns its ID.
const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO public.categories (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [categoryName]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

// Updates an existing category's name.
const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE public.categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const result = await db.query(query, [categoryName, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

export { getAllCategories, getCategoryById, getCategoriesForProject, getProjectsForCategory, assignCategoryToProject, updateCategoryAssignments, createCategory, updateCategory };
