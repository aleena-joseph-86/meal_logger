const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users  -> register
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, height, weight } = req.body;
    // basic validation
    if (!name || !age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'Missing required fields. Required: name, age, gender, height, weight' });
    }
    if (!['male','female'].includes(gender.toLowerCase())) {
      return res.status(400).json({ error: 'gender must be "male" or "female"' });
    }

    const user = new User({
      name,
      age,
      gender: gender.toLowerCase(),
      height,
      weight
    });
    await user.save();
    const bmr = user.calculateBMR();
    return res.status(201).json({ user, bmr });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /users/:userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.bmr = (new (require('../models/User'))(user)).calculateBMR ? (function(){ const temp = require('../models/User'); return null; })() : undefined;
    // simpler: compute directly
    const UserModel = require('../models/User');
    const userDoc = await UserModel.findOne({ userId: req.params.userId });
    user.bmr = userDoc ? userDoc.calculateBMR() : null;
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;