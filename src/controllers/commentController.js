const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { ticketId } = req.params;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment text is required",
            });
        }

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found",
            });
        }

        const comment = await Comment.create({
            text: text.trim(),
            ticket: ticketId,
            createdBy: req.user._id,
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("createdBy", "name email");

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create comment",
            error: error.message,
        });
    }
};

const getComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found",
            });
        }

        const comments = await Comment.find({
            ticket: ticketId,
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comments",
            error: error.message,
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        // Admin can delete any comment.
        // Normal member can delete only their own comment.
        if (
            req.user.role !== "admin" &&
            comment.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete your own comments",
            });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.json({
            message: "Comment deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message,
        });
    }
};

module.exports = {
    createComment,
    getComments,
    deleteComment,
};