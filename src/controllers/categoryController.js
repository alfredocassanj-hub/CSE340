import { body, validationResult } from 'express-validator';
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
} from '../models/categories.js';

// Validação do servidor: obrigatório, mínimo 3, máximo 100
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('O nome da categoria é obrigatório.').bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome da categoria deve ter entre 3 e 100 caracteres.'),
];

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

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Nova Categoria', errors: [], formData: {} });
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('new-category', {
                title: 'Nova Categoria',
                errors: errors.array(),
                formData: req.body,
            });
        }

        const newId = await createCategory(req.body.name);
        req.session.flash = { type: 'success', message: 'Category created successfully.' };
        res.redirect(`/category/${newId}`);
    } catch (err) {
        next(err);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('edit-category', { title: 'Editar Categoria', errors: [], category });
    } catch (err) {
        next(err);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('edit-category', {
                title: 'Editar Categoria',
                errors: errors.array(),
                category: { category_id: id, name: req.body.name },
            });
        }

        const updatedId = await updateCategory(id, req.body.name);

        if (!updatedId) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        req.session.flash = { type: 'success', message: 'Category updated successfully.' };
        res.redirect(`/category/${id}`);
    } catch (err) {
        next(err);
    }
};

export {
    showCategories,
    showCategoryDetails,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
};