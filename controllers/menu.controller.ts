import type { Request, Response } from 'express';
import { getCollections } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRsponse.js';

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

        const { category, dietaryTags, page } = req.query as Record<string, string | undefined>;

        const pageNum = parseInt(page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const toSkip = (pageNum - 1) * limit;

        const query: Record<string, unknown> = {};

        if (category) {
            query.categoryName = { $regex: `^${category}$`, $options: 'i' };
        };

        if (dietaryTags) {
            query.dietaryTags = {
                $all: dietaryTags.split(','),
            };
        };

        const totalDoc = await menuCollection.countDocuments(query);
        const totalPages = Math.ceil(totalDoc / limit);

        const result = await menuCollection.find(query).skip(toSkip).limit(limit).sort({ createdAt: -1 }).toArray();

        res.setHeader("X-Total-Pages", totalPages.toString());
        res.setHeader("X-Total-Count", totalDoc.toString());
        res.setHeader("X-Current-Page", pageNum.toString());

        if (!result) {
            ApiResponse.error(res, "Failed to get item", 404)
        };

        ApiResponse.success(res, "Menu Fetched Successfully", result, 201);

    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to fetch menu');
    }
};
