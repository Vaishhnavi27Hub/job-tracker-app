const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user email settings
router.get("/email", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("emailNotifications");
    res.json(user.emailNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update email settings
router.put("/email", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.emailNotifications = {
      ...user.emailNotifications,
      ...req.body,
    };
    await user.save();
    res.json(user.emailNotifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;