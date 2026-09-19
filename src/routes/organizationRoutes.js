import express from 'express';
import { showOrganizations, showOrganizationDetails } from '../controllers/organizationController.js';

const router = express.Router();

router.get('/', showOrganizations);
router.get('/:id', showOrganizationDetails);

export default router;