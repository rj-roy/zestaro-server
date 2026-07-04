import express from 'express';
import { getMenu, getMenuByQuery } from '../controllers/menu.controller.js';

const router = express.Router();

router.get('/all', getMenu);
router.get('/query', getMenuByQuery);

export default router;