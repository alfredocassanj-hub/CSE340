import { Router } from 'express';

import {
    projectValidation,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
} from '../controllers/projectController.js';

import {
    requireLogin,
    requireRole
} from '../controllers/users.js';

const router = Router();

router.get(
    '/new-project',
    requireLogin,
    requireRole(2),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireLogin,
    requireRole(2),
    projectValidation,
    processNewProjectForm
);

router.get(
    '/edit-project/:id',
    requireLogin,
    requireRole(2),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireLogin,
    requireRole(2),
    projectValidation,
    processEditProjectForm
);

router.get(
    '/assign-categories/:projectId',
    requireLogin,
    requireRole(2),
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    requireLogin,
    requireRole(2),
    processAssignCategoriesForm
);

export default router;