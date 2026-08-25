import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { ApiError } from "../utils/ApiError.js";
import { getCollections } from "../config/db.js";
import { ApiResponse } from "../utils/ApiRsponse.js";

export const createCheckout = async (req: Request, res: Response) => {
    try {
        const { fullName, address, contact, note, userId, userName, orderedItems } = req.body;

        switch (true) {
            case orderedItems.length === 0:
                throw new ApiError(400, "Couldn't find item");

            case !ObjectId.isValid(userId):
                throw new ApiError(404, "Invalid User");

            case !fullName || !address || !contact || !orderedItems:
                throw new ApiError(400, "Please fill correctly all information!");
        };

        const { checkoutCollection, cartCollection } = getCollections();

        //duplicate && get price

        const result = await checkoutCollection.insertOne({
            fullName, address, contact, note, userId, userName, orderedItems,
            createdAt: new Date(),
        });

        if (!result.acknowledged || !result) {
            ApiResponse.error(res, "Somethimg went wrong! Please try again");
        };

        const hideCartItem = await cartCollection.updateOne(
            {userId},
            {$set: {
                cart: [],
            }},
        );
        if(!hideCartItem.acknowledged){
            ApiResponse.error(res, "Cart data failed to update!");
        };

        ApiResponse.success(res, "Order placed successfully!")

    } catch (error) {
        ApiResponse.error(res, "Somethimg went wrong! Please try again");
    };
};