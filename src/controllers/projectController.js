const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {
      
        const { name, key, description } = req.body;

        if (!name || !key) {
      return res.status(400).json({
        message: "Project name and key are required",
      });
    }

    const existingProject = await Project.findOne({
      key: key.toUpperCase(),
    });

    if (existingProject) {
      return res.status(400).json({
        message: "Project key already exists",
      });
    }

        const project = await Project.create({
            name,
            key,
            description,
            createdBy: req.user._id,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create project",
            error: error.message,
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message,
        });
    }
};

const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch project",
            error: error.message,
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { name, key, description } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                name,
                key,
                description,
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update project",
            error: error.message,
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete project",
            error: error.message,
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};