const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);

module.exports = router;