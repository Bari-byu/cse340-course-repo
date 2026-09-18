
// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsForCategory } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const { id } = req.params;
    const category = await getCategoryById(id);

    // If no category matches the given ID, forward a 404 error
    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsForCategory(id);
    const title = category.category_name;

    res.render('category', { title, category, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };
