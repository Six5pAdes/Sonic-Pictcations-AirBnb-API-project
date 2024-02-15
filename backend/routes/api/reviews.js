const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Review } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// 11. Get all current user's reviews
// require authentication
router.get("/current", async (req, res) => {});

// 14. Add image to review based on id
// require authentication
// require proper authorization
router.post("/:reviewId/images", async (req, res) => {});

// 15. Edit review
// require authentication
// require proper authorization
router.put("/:reviewId", async (req, res) => {});

// 16. Delete review
// require authentication
// require proper authorization
router.delete("/:reviewId", async (req, res) => {});

module.exports = router;
