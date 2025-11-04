const express = require("express");
const Alert = require("../models/Alert");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all alerts for user
router.get("/", auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id })
      .populate('jobId', 'company position')
      .sort({ alertDate: 1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create alert
router.post("/", auth, async (req, res) => {
  try {
    const alert = new Alert({
      ...req.body,
      userId: req.user._id,
    });
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update alert
router.put("/:id", auth, async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    Object.assign(alert, req.body);
    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete alert
router.delete("/:id", auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle complete
router.patch("/:id/complete", auth, async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.isCompleted = !alert.isCompleted;
    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;