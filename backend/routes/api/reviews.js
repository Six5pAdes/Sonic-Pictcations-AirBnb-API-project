const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Review,
  User,
  Spot,
  SpotImage,
  ReviewImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

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

  for (let index = 0; index < allReviews.length; index++) {
    let findSpotImg = await SpotImage.findOne({
      where: { spotId: allReviews[index].Spot.id, preview: true },
    });
    if (findSpotImg) {
      allReviews[index].Spot.dataValues.previewImage = findSpotImg.url;
    } else allReviews[index].Spot.dataValues.previewImage = null;
  }

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
  if (!findReview)
    return res.status(404).json({ message: "Review couldn't be found" });
  if (findReview.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
    });

  const imageTally = await ReviewImage.findAll({
    where: { reviewId: reviewId },
  });
  if (imageTally.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const newReviewImg = await ReviewImage.create({
    reviewId,
    url,
  });

  res.json({
    id: newReviewImg.id,
    url: newReviewImg.url,
  });
});

// 15. Edit review
// require authentication
// require proper authorization
router.put("/:reviewId", [requireAuth, validateReview], async (req, res) => {
  const { user } = req;
  const { review, stars } = req.body;

  const findReview = await Review.findByPk(req.params.id);
  if (!findReview)
    return res.status(404).json({ message: "Review couldn't be found" });
  if (findReview.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
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

  const findReview = await Review.findByPk(req.params.id);
  if (!findReview)
    return res.status(404).json({ message: "Review couldn't be found" });
  if (findReview.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
    });

  await findReview.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
