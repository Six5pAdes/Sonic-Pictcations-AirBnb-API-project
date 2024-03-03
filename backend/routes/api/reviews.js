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
    let thisReview = allReviews[index].toJSON();

    let findSpotImg = await SpotImage.findOne({
      where: { spotId: thisReview.Spot.id, preview: true },
    });

    if (findSpotImg) {
      thisReview.Spot.previewImage = findSpotImg.url;
    } else thisReview.Spot.previewImage = null;
    allReviews[index] = thisReview;
  }

  const results = allReviews.map((review) => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: new Date(review.createdAt).toLocaleString("sv-SE"),
    updatedAt: new Date(review.updatedAt).toLocaleString("sv-SE"),
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName,
    },
    Spot: {
      id: review.Spot.id,
      ownerId: review.Spot.ownerId,
      address: review.Spot.address,
      city: review.Spot.city,
      state: review.Spot.state,
      country: review.Spot.country,
      lat: parseFloat(review.Spot.lat),
      lng: parseFloat(review.Spot.lng),
      name: review.Spot.name,
      price: parseFloat(review.Spot.price),
      previewImage: review.Spot.previewImage,
    },
    ReviewImages: review.ReviewImages,
  }));

  return res.json({ Reviews: results });
});

// 14. Add image to review based on id
// require authentication
// require proper authorization
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { url } = req.body;
  let { reviewId } = req.params;

  const findReview = await Review.findByPk(reviewId);
  if (!findReview)
    return res.status(404).json({ message: "Review couldn't be found" });
  if (findReview.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Review must belong to the current user",
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

  return res.json({
    id: newReviewImg.id,
    url: newReviewImg.url,
  });
});

// 15. Edit review
// require authentication
// require proper authorization
router.put("/:reviewId", [requireAuth, validateReview], async (req, res) => {
  const { user } = req;
  let { reviewId } = req.params;
  const { review, stars } = req.body;

  const findReview = await Review.findByPk(reviewId);
  if (!findReview)
    return res.status(404).json({ message: "Review couldn't be found" });
  if (findReview.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Review must belong to the current user",
    });

  if (review) findReview.review = review;
  if (stars) findReview.stars = parseFloat(stars);
  findReview.createdAt = new Date(findReview.createdAt).toLocaleString("sv-SE");
  findReview.updatedAt = new Date(findReview.updatedAt).toLocaleString("sv-SE");

  await findReview.save();
  return res.json(findReview);
});

// 16. Delete review
// require authentication
// require proper authorization
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { user } = req;
  let { reviewId } = req.params;

  const findReview = await Review.findByPk(reviewId);
  if (!findReview)
    return res.status(404).json({ message: "Review couldn't be found" });
  if (findReview.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Review must belong to the current user",
    });

  await findReview.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
