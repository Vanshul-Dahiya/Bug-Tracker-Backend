const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const router = express.Router();

router.use(protect);

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

module.exports = router;