const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth"); // Ensure this is correct
const {
  getAllLeaves,
  createLeave,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

// Get all leaves
router.get("/", protect(["admin", "hr", "manager", "employee"]), getAllLeaves);

// Create new leave request
router.post("/", protect(["hr", "manager", "employee"]), createLeave);

// Approve leave request
router.put("/:id/approve", protect(["admin", "hr", "manager"]), approveLeave);

// Reject leave request
router.put("/:id/reject", protect(["admin", "hr", "manager"]), rejectLeave);

module.exports = router;
