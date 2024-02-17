const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { ReviewImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// 22. Delete review image
// require authentication
// require proper authorization
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  const { imageId } = req.params;

  const findReviewImg = await ReviewImage.findOne({ where: { id: imageId } });

  await findReviewImg.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
