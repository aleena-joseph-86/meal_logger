const mongoose = require("mongoose");

const NutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  { _id: false }
);

const MealSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // references User.userId
    meals: {
      type: String,
      required: true,
      enum: ["breakfast", "lunch", "dinner"],
    },
    items: [{ type: String }],
    nutrition: { type: NutritionSchema, default: () => ({}) },
    loggedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);
