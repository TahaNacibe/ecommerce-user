import { Order } from "@/models/Order";
import UserProfile from "@/models/UserProfile";
import mongoose from "mongoose";

const handler = async (req, res) => {
    try {
        // Connect to MongoDB only once
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        // Access the email from the query parameters
        const { ownerEmail } = req.query; // Changed from req.body to req.query
        console.log("Owner email is for now", ownerEmail);

        if (ownerEmail) {
            // Get the user additional information
            const userInfo = await UserProfile.findOne({ email: ownerEmail });
            console.log("the details will be soon", userInfo.orders)
            // Get orders from the order collection
            const userOrders = await Order.find({ _id: userInfo.orders }, null, { sort: { "updatedAt": 1 } });
            
            res.json(userOrders);
        } else {
            res.json({ error: "Owner email is required" });
        }
    } catch (error) {
        res.json({ error: "Something went wrong. We're cocked." });
    }
}

export default handler;
