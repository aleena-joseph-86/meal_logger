const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Meal = require("../models/Meal");
const food_db = require("../utils/food_db");

// POST /log_meals
router.post("/log_meals", async (req, res) => {
  try {
    const { user, userId, meal, items, loggedAt } = req.body;
    if (!meal || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Provide meal and items." });
    }

    // find user either by userId 
    let userDoc = null;
    if (userId) {
      userDoc = await User.findOne({ userId: userId });
    } else if (user) {
      userDoc = await User.findOne({ name: new RegExp(`^${user}$`, "i") });
    }
    if (!userDoc) {
      return res
        .status(404)
        .json({
          error: "User not found. Provide valid userId or user (name).",
        });
    }

    const mealType = meal.toLowerCase();
    const allowed = ["breakfast", "lunch", "dinner"];
    if (!allowed.includes(mealType)) {
      return res
        .status(400)
        .json({ error: `meal must be one of ${allowed.join(", ")}` });
    }

    // compute nutrition
    let nutrition = { calories: 0, protein: 0, carbs: 0, fiber: 0 };
    const unknownItems = [];
    for (const item of items) {
      const itemTrim = item.trim();
      const info = food_db[itemTrim];
      if (!info) {
        unknownItems.push(itemTrim);
        continue;
      }
      nutrition.calories += Number(info.calories || 0);
      nutrition.protein += Number(info.protein || 0);
      nutrition.carbs += Number(info.carbs || 0);
      nutrition.fiber += Number(info.fiber || 0);
    }

    // round
    nutrition = {
      calories: Math.round(nutrition.calories * 100) / 100,
      protein: Math.round(nutrition.protein * 100) / 100,
      carbs: Math.round(nutrition.carbs * 100) / 100,
      fiber: Math.round(nutrition.fiber * 100) / 100,
    };

    const newMeal = new Meal({
      userId: userDoc.userId,
      mealType,
      foodItems: items,
      nutrition,
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    });
    await newMeal.save();

    return res.status(201).json({ meal: newMeal, unknownItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /meals?date=YYYY-MM-DD&userId=...
router.get("/meals", async (req, res) => {
  try {
    const { date, userId } = req.query;
    if (!date || !userId)
      return res
        .status(400)
        .json({
          error: "Require date and userId query params. date=YYYY-MM-DD",
        });

    const start = new Date(date + "T00:00:00");
    const end = new Date(date + "T23:59:59.999");

    const meals = await Meal.find({
      userId,
      loggedAt: { $gte: start, $lte: end },
    })
      .sort({ loggedAt: 1 })
      .lean();

    // compute totals
    const totals = { calories: 0, protein: 0, carbs: 0, fiber: 0 };
    for (const m of meals) {
      const n = m.nutrition || {};
      totals.calories += Number(n.calories || 0);
      totals.protein += Number(n.protein || 0);
      totals.carbs += Number(n.carbs || 0);
      totals.fiber += Number(n.fiber || 0);
    }
    // round
    for (const k of Object.keys(totals))
      totals[k] = Math.round(totals[k] * 100) / 100;

    return res.json({ date, userId, meals, totals });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /status/:userId?date=YYYY-MM-DD
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const day = date || new Date().toISOString().slice(0, 10);
    const start = new Date(day + "T00:00:00");
    const end = new Date(day + "T23:59:59.999");

    const meals = await Meal.find({
      userId,
      loggedAt: { $gte: start, $lte: end },
    }).lean();

    const totals = { calories: 0, protein: 0, carbs: 0, fiber: 0 };
    for (const m of meals) {
      const n = m.nutrition || {};
      totals.calories += Number(n.calories || 0);
      totals.protein += Number(n.protein || 0);
      totals.carbs += Number(n.carbs || 0);
      totals.fiber += Number(n.fiber || 0);
    }
    for (const k of Object.keys(totals))
      totals[k] = Math.round(totals[k] * 100) / 100;

    const bmr = user.calculateBMR();

    return res.json({
      userId,
      date: day,
      totals,
      bmr,
      mealsCount: meals.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
