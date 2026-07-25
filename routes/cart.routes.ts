import { Router } from "express";
import { createCart } from "../controllers/cart.controller.js";

const router = Router();

router.post('/create', createCart);

export default router;