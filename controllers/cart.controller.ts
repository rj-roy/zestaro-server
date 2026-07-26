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

export const getCartByUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!userId) throw new ApiError(404, "User Not Found!");

    const { cartCollection } = getCollections();

    const [result] = await cartCollection.aggregate([
        { $match: { userId } },
        {
            $project: {
                _id: 0,
                cartItemIds: {
                    $map: {
                        input: "$cart",
                        as: "item",
                        in: "$$item.itemId",
                    },
                },
            },
        },
    ]).toArray();


    // const addedItems = await cartCollection.findOne(
    //     { userId },
    //     {
    //         projection: {
    //             _id: 0,
    //             "cart.itemId": 1,
    //         },
    //     },
    // )

    // const result = { cartItemIds: addedItems?.cart?.map((item: { itemId: any; }) => item.itemId) ?? [] }

    ApiResponse.success(res, "Added cart items", result, 201)
};

export const getAnsIfItemInCart = async (req: Request, res: Response): Promise<void> => {
    const { userId, itemId } = req.query;
    if (!userId || !itemId) {
        throw new ApiError(404, "User not found");
    };

    const { cartCollection } = getCollections();

    const result = (await cartCollection.countDocuments({
        userId,
        "cart.itemId": itemId,
    })) > 0;
    res.send(result);
};