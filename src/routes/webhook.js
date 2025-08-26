const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Meal = require("../models/Meal");
const food_db = require("../utils/food_db");

// POST /webhook
// { "userId": "c7b5d3e0-4a22-4a81-9e21-bb14a9d942fd", "message": "log lunch: Jeera Rice, Dal" }
router.post("/webhook", async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    const userDoc = await User.findOne({ userId });
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    // parse message like "log lunch: Jeera Rice, Dal"
    const m = message.trim().match(/^log\s+(\w+)\s*:\s*(.+)$/i);
    if (!m) {
      return res
        .status(400)
        .json({ error: 'Format: "log <meal>: item1, item2"' });
    }

    const mealType = m[1].toLowerCase();
    const items = m[2]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // compute nutrition (same as /log_meals)
    const allowed = ["breakfast", "lunch", "dinner"];
    if (!allowed.includes(mealType))
      return res
        .status(400)
        .json({ error: `meal must be one of ${allowed.join(", ")}` });

    let nutrition = { calories: 0, protein: 0, carbs: 0, fiber: 0 };
    const unknownItems = [];
    for (const item of items) {
      const info = food_db[item];
      if (!info) {
        unknownItems.push(item);
        continue;
      }
      nutrition.calories += Number(info.calories || 0);
      nutrition.protein += Number(info.protein || 0);
      nutrition.carbs += Number(info.carbs || 0);
      nutrition.fiber += Number(info.fiber || 0);
    }
    for (const k of Object.keys(nutrition))
      nutrition[k] = Math.round(nutrition[k] * 100) / 100;

    const meal = new Meal({
      userId: userDoc.userId,
      meals: mealType,
      items,
      nutrition,
    });
    await meal.save();

    return res.json({ ok: true, meal, unknownItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
