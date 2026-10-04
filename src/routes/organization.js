import { Router } from 'express';

import {
    organizationValidation,
    editOrganizationValidation,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
} from '../controllers/organizationController.js';

import {
    requireLogin,
    requireRole
} from '../controllers/users.js';

const router = Router();

router.get(
    '/new-organization',
    requireLogin,
    requireRole(2),
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireLogin,
    requireRole(2),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireLogin,
    requireRole(2),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireLogin,
    requireRole(2),
    editOrganizationValidation,
    processEditOrganizationForm
);

export default router;