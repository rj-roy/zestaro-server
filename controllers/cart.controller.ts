import { Request, Response } from "express";
import { getCollections } from "../config/db.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, userName, checkedItem, localCart } = req.body;

        if (!userId || !userName) {
            throw new ApiError(505, "Something Went Wrong! Please Try again. User not found!");
        };

        const cart = [JSON.parse(checkedItem), ...(localCart ? JSON.parse(localCart) : [])];
        const { cartCollection } = getCollections();
        const isExistCart = await cartCollection.findOne({ userId });

        if (isExistCart) {
            const result = await cartCollection.updateOne(
                { userId },
                {
                    $addToSet: {
                        cart: {
                            $each: cart,
                        },
                    },
                    $set: {
                        updatedAt: new Date(),
                    },
                }
            );
            ApiResponse.success(res, "Item added to cart", result, 201);

        } else if (!isExistCart) {
            const result = await cartCollection.insertOne({
                userId,
                userName,
                cart,
                createdAt: new Date(),
            });
            ApiResponse.success(res, "Item added to cart", result, 201);
        };

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Failed to add item to cart");
    };
};