const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router.post(
    "/",
    authorizeRoles("admin"),
    createProject
);

router.get("/", getProjects);

router.get("/:id", getProject);

router.put(
    "/:id",
    authorizeRoles("admin"),
    updateProject
);

router.delete(
    "/:id",
    authorizeRoles("admin"),
    deleteProject
);

module.exports = router;