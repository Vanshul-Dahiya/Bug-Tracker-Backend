const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createProject,
    getProjects,
    getProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles("admin"), createProject);

router.get("/", getProjects);

router.get("/:id", getProject);

module.exports = router;