import { Router } from 'express';
import { getItemPriceByCart, getMenu, getMenuByQuery } from '../controllers/menu.controller.js';

const router = Router();

router.get('/all', getMenu);
router.get('/query', getMenuByQuery);
router.post('/price/cart', getItemPriceByCart);

export default router;
