const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { ReviewImage, Review } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// 22. Delete review image
// require authentication
// require proper authorization
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;
  let { imageId } = req.params;

  const findReviewImg = await ReviewImage.findByPk(imageId);
  if (!findReviewImg)
    return res.status(404).json({ message: "Review Image couldn't be found" });

  const findReview = await Review.findByPk(findReviewImg.reviewId);
  if (findReview.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Review must belong to the current user",
    });

  await findReviewImg.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
