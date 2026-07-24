import type { Request, Response } from 'express';
import { getCollections } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const getMenu = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { menuCollection } = getCollections();
        const result = await menuCollection.find().toArray();
        res.send({ success: true, message: 'Menu fetched successfully', data: result });
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to fetch menu');
    }
};

export const getMenuByQuery = async (req: Request, res: Response): Promise<void> => {
    try {
        const { menuCollection } = getCollections();

        const { category, dietaryTags } = req.query as Record<string, string | undefined>;
        const query: Record<string, unknown> = {};

        if (category) {
            query.categoryName = { $regex: `^${category}$`, $options: 'i' };
        }

        if (dietaryTags) {
            query.dietaryTags = {
                $all: dietaryTags.split(','),
            };
        }

        const result = await menuCollection.find(query).toArray();
        // res.send({ success: true, message: 'Menu fetched successfully', data: result });
        if(result){
            throw new ApiError(404, "dlskfjweiof kldsjfiof, disofjdsf,")
        }
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to fetch menu');
    }
};
