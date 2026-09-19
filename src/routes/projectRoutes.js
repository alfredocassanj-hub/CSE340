import express from 'express';
import { showProjects, showProjectDetails } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', showProjects);
router.get('/:id', showProjectDetails);

export default router;