import { Router } from 'express';

import {
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from '../controllers/categoryController.js';

import {
    requireLogin,
    requireRole
} from '../controllers/users.js';

const router = Router();

router.get(
    '/new-category',
    requireLogin,
    requireRole(2),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireLogin,
    requireRole(2),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    requireLogin,
    requireRole(2),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireLogin,
    requireRole(2),
    categoryValidation,
    processEditCategoryForm
);

export default router;