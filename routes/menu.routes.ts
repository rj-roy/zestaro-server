import { Router } from 'express';
import { getMenu, getMenuByQuery } from '../controllers/menu.controller.js';

const router = Router();

router.get('/all', getMenu);
router.get('/query', getMenuByQuery);

export default router;
