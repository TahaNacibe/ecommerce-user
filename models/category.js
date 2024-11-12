import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    usedCount: { type: Number, default: 0 },
    parentFor: { type: Number, default: 0 },
    parent: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: [
        { 
          key: { type: String, required: true },  // Property key (e.g., 'color', 'size')
          values: { type: [String], required: true }  // Property value (e.g., 'red', 'M')
        }
    ]
});

export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
