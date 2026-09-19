import express from 'express';
import { showCategories, showCategoryDetails } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', showCategories);
router.get('/:id', showCategoryDetails);

export default router;