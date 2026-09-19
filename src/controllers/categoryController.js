import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

const showCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Project Categories', categories });
    } catch (err) {
        next(err);
    }
};

const showCategoryDetails = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', { title: category.name, category, projects });
    } catch (err) {
        next(err);
    }
};

export { showCategories, showCategoryDetails };