import { Product } from "@/models/product";
import mongoose from "mongoose";

const handler = async (req, res) => {
    try {
        // Get the request parameters
        const { categories } = req.query;

        // Split categories string into an array
        const categoryArray = categories ? categories.split('_') : [];

        // Connect with the database if not already connected
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        if (categoryArray && categoryArray.length > 0) {
            // Fetch the data
            const data = await Product.find(
                { categories: { $in: categoryArray } },
                null,
                { sort: { updatedAt: 1 } }
            );
    
            res.status(200).json(data);
        } else {
             // Fetch the data
             const data = await Product.find(
                {},
                null,
                { sort: { updatedAt: 1 } }
            );
    
            res.status(200).json(data);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

export default handler;
