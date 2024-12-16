import { Product } from "@/models/product";
import mongoose from "mongoose";

const handler = async (req, res) => {
    try {
      // Connect to MongoDB only once
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
        }
        
        //* get request data
        const { searchQuery } = req.query
        //* get the data 
        if (searchQuery != "") {
            const data = await Product.find({ title: { $regex: searchQuery, $options: "i" } }, null, { sort: { "updatedAt": 1 }  })
            res.status(200).json(data); // Return the data as JSON
        } else {
            const data = await Product.find({}); // Fetch your data
            res.status(200).json(data); // Return the data as JSON
        }
    } catch (error) {
        console.error("error stack: ", error)
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
  
  export default handler;