const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Review, User, Spot, ReviewImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// 11. Get all current user's reviews
// require authentication
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const allReviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        attributes: { exclude: ["description", "createdAt", "updatedAt"] },
      },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
  });

  res.json({ Reviews: allReviews });
});

// 14. Add image to review based on id
// require authentication
// require proper authorization
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { url } = req.body;
  const { reviewId } = req.params;

  const findReview = await Review.findOne({
    where: { id: reviewId },
  });
  const newReviewImg = await ReviewImage.create({
    url,
    reviewId,
  });

  res.json({
    id: newReviewImg.id,
    url: newReviewImg.url,
  });
});

// 15. Edit review
// require authentication
// require proper authorization
router.put("/:reviewId", requireAuth, async (req, res) => {
  const { user } = req;
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  const findReview = await Review.findOne({
    where: { id: reviewId },
  });

  review ? (findReview.review = review) : findReview.review;
  stars ? (findReview.stars = stars) : findReview.stars;

  await findReview.save();
  res.json(findReview);
});

// 16. Delete review
// require authentication
// require proper authorization
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { user } = req;
  const { reviewId } = req.params;

  const review = await Review.findOne({ where: { id: reviewId } });

  await review.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
