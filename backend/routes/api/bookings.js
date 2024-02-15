const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Booking } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// 17. Get all belongings of current user
// require authentication
router.get("/current", async (req, res) => {});

// 20. Edit booking
// require authentication
// require proper authorization
router.put("/:bookingId", async (req, res) => {});

// 21. Delete booking
// require authentication
// require proper authorization
router.delete("/:bookingId", async (req, res) => {});

module.exports = router;
