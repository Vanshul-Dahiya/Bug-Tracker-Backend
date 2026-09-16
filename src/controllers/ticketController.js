const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      priority,
      assignedTo,
    } = req.body;

    if (!title || !description || !project) {
      return res.status(400).json({
        message: "Title, description and project are required",
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      project,
      priority,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    const populatedTicket = await ticket.populate([
      {
        path: "project",
        select: "name key",
      },
      {
        path: "assignedTo",
        select: "name email",
      },
      {
        path: "createdBy",
        select: "name email",
      },
       {
        path: "updatedBy",
        select: "name email",
      },
    ]);

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

const getTickets = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      project,
      assignedTo,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (project) {
      filter.project = project;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate("project", "name key")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("project", "name key")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ticket",
      error: error.message,
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      updatedBy: req.user._id,
    };

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("project", "name key")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};