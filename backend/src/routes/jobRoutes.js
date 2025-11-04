const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Job = require("../models/Job");
const auth = require("../middleware/auth");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_timestamp_originalname
    const uniqueName = `${req.user._id}_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create Job with optional file upload
router.post("/", auth, upload.single("resume"), async (req, res) => {
  try {
    const { company, position, status, skills } = req.body;
    
    // Parse skills if it's a string
    let parsedSkills = skills;
    if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const jobData = {
      company,
      position,
      status,
      skills: parsedSkills,
      createdBy: req.user._id,
    };

    // Add resume path if file was uploaded
    if (req.file) {
      jobData.resume = `/uploads/${req.file.filename}`;
    }

    const job = new Job(jobData);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Jobs for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Job with optional file upload
router.put("/:id", auth, upload.single("resume"), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job fields
    const { company, position, status, skills } = req.body;
    
    if (company) job.company = company;
    if (position) job.position = position;
    if (status) job.status = status;
    
    if (skills) {
      job.skills = typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(s => s)
        : skills;
    }

    // Handle resume update
    if (req.file) {
      // Delete old resume file if it exists
      if (job.resume && job.resume.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, "../..", job.resume);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      // Set new resume path
      job.resume = `/uploads/${req.file.filename}`;
    }

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Job
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete associated resume file
    if (job.resume && job.resume.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, "../..", job.resume);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download resume endpoint
router.get("/resume/:filename", auth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  // Security check: ensure the file belongs to the current user
  if (!filename.startsWith(req.user._id.toString())) {
    return res.status(403).json({ message: "Access denied" });
  }
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;