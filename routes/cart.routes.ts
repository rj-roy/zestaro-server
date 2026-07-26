import { Router } from "express";
import { createCart, getAnsIfItemInCart, getCartByUser } from "../controllers/cart.controller.js";
import { postLimiter, publicLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post('/create', postLimiter, createCart);
router.get('/get/items/:id', publicLimiter, getCartByUser);
router.get('/get/item/exist', getAnsIfItemInCart);

export default router;