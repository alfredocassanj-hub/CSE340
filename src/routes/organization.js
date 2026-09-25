import { Router } from 'express';
import {
    organizationValidation,
    editOrganizationValidation,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
} from '../controllers/organizationController.js';

const router = Router();

router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', editOrganizationValidation, processEditOrganizationForm);

export default router;