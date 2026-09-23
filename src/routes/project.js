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

const router = Router();

router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

export default router;