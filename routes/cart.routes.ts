import { Router } from "express";
import { createCart, getAnsIfItemInCart, getCartByUser, getCartItemCount } from "../controllers/cart.controller.js";
import { postLimiter, publicLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post('/create', createCart);
router.get('/get/items', publicLimiter, getCartByUser);
router.get('/get/item/exist', getAnsIfItemInCart);
router.get('/get/item/count/:id', getCartItemCount);

export default router;