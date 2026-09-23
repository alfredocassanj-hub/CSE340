import { body, validationResult } from 'express-validator';
import { getCategoryById, createCategory, updateCategory } from '../models/categories.js';

// Validação do servidor (obrigatório, mín. 3, máx. 100)
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('O nome da categoria é obrigatório.').bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('O nome da categoria deve ter entre 3 e 100 caracteres.')
];

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
        formData: req.body
      });
    }
    const newId = await createCategory(req.body.name);
    res.redirect(`/category/${newId}`);
  } catch (err) {
    next(err);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      const err = new Error('Categoria não encontrada');
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
        category: { category_id: id, name: req.body.name }
      });
    }
    const updatedId = await updateCategory(id, req.body.name);
    if (!updatedId) {
      const err = new Error('Categoria não encontrada');
      err.status = 404;
      return next(err);
    }
    res.redirect(`/category/${id}`);
  } catch (err) {
    next(err);
  }
};

export {
  categoryValidation,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
  /* + os que já exportas */
};