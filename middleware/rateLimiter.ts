import rateLimit from "express-rate-limit";

export const publicLimiter = rateLimit({ windowMs: 60_000, max: 60 });
export const postLimiter = rateLimit({ windowMs: 60_000, max: 3 });