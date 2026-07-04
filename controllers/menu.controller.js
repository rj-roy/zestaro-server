import { getCollections } from "../config/db.js"

export const getMenu = async (req, res) => {
    const { menuCollection } = getCollections();
    const result = await menuCollection.find().toArray();
    res.send(result);
};

export const getMenuByQuery = async (req, res) => {
    const { menuCollection } = getCollections();

    const { category, dietaryTags } = req.query;
    const query = {};

    if (category) {
      query.categoryName = { $regex: `^${category}$`, $options: "i" };
    };

    if (dietaryTags) {
      query.dietaryTags = {
        $all: dietaryTags.split(","),
      };
    };

    const result = await menuCollection.find(query).toArray();
    res.send(result);
};