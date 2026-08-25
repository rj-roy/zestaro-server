import { Router } from "express";
import { createCart, getAnsIfItemInCart, getCartByUser, getCartItemCount, removeCartItem, updateQuantity } from "../controllers/cart.controller.js";
import { cartUQLimiter, postLimiter, publicLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post('/create', postLimiter, createCart);
router.get('/get/items', publicLimiter, getCartByUser);
router.get('/get/item/exist', getAnsIfItemInCart);
router.get('/get/item/count/:id', getCartItemCount);
router.patch('/update/item/quantity', updateQuantity);
router.patch('/update/remove/item/', removeCartItem);

export default router;