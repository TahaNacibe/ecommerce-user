import mongoose, { model, models } from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  usedCount: { type: Number, default: 0 },
  parentFor: { type: Number, default: 0 },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  properties: [
    {
      key: { type: String, required: true },
      values: { type: [String], required: true },
    },
  ],
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
