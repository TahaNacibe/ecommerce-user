// Import necessary dependencies
import { Preferences } from "@/models/prefernces";
import mongoose from "mongoose";


// GET handler to fetch shop settings
async function handler(req, res) {
    try {
         // Connect to MongoDB only once
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
        }

        // Fetch the shop preferences - we expect only one document
        const preferences = await Preferences.findOne().lean();

        // If no preferences exist, create default ones
        if (!preferences) {
            const defaultPreferences = await Preferences.create({
                name: "Default Shop Name",
                icon: "/default-icon.png"
            });

            return res.status(200).json(defaultPreferences); // Respond with default preferences
        }

        // Return the fetched preferences
        return res.status(200).json(preferences); // Respond with the fetched preferences
    } catch (error) {
        console.error("Error fetching shop settings:", error);
        return res.status(500).json({
            error: "Failed to fetch shop settings",
            details: error.message,
        }); // Respond with error details
    }
}

export default handler;
