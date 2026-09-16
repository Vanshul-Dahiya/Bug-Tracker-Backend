const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createComment,
    getComments,
    deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.use(protect);

router.post("/ticket/:ticketId", createComment);

router.get("/ticket/:ticketId", getComments);

router.delete("/:id", deleteComment);

module.exports = router;