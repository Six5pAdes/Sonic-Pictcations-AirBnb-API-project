const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// 4. Get all spots
router.get("/", async (req, res) => {
  // 24. add query filters to get all spots
});

// 5. Get all spots owned by current user
// require authentication
router.get("/current", async (req, res) => {});

// 6. Get spot details from id
router.get("/:spotId", async (req, res) => {});

// 7. Create spot
// require authentication
router.post("/", async (req, res) => {});

// 8. Add image to spot based on id
// require authentication
// require proper authorization
router.post("/:spotId/images", async (req, res) => {});

// 9. Edit spot
// require authentication
// require proper authorization
router.put("/:spotId", async (req, res) => {});

// 10. Delete spot
// require authentication
// require proper authorization
router.delete("/:spotId", async (req, res) => {});

// 12. Get all reviews by spot's id
router.get("/:spotId/reviews", async (req, res) => {});

// 13. Add review to spot based on id
// require authentication
router.post("/:spotId/reviews", async (req, res) => {});

// 18. Get all bookings for spot based on id
// require authentication
router.get("/:spotId/bookings", async (req, res) => {});

// 19. Create booking from spot based on id
// require authentication
// require proper authorization
router.post("/:spotId/bookings", async (req, res) => {});

module.exports = router;
