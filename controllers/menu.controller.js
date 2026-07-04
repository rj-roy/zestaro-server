import { getCollections } from "../config/db.js"

export const getMenu = async (req, res) => {
    const { menuCollection } = getCollections();
    const result = await menuCollection.find().toArray();
    res.send(result);
};

export const getMenuByQuery = async (req, res) => {
    const { menuCollection } = getCollections();
    const category = req.query.category;

    const result = await menuCollection.find({
        categoryName : category
    }).toArray();

    res.send(result);
};