const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Spot,
  User,
  SpotImage,
  Booking,
  Review,
  ReviewImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validateDates = [
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      let givenStartDate = new Date(value);
      let currentDate = new Date();

      if (currentDate > givenStartDate) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      let givenStartDate = new Date(req.body.startDate);
      let givenEndDate = new Date(value);

      if (givenStartDate <= givenEndDate) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
  handleValidationErrors,
];

const queryParams = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

// 4. Get all spots
router.get("/", queryParams, async (req, res) => {
  // 24. add query filters to get all spots
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  page = page || 1;
  size = size || 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;

  const pagination = {
    limit: size,
    offset: size * (page - 1),
  };
});

// 5. Get all spots owned by current user
// require authentication
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const currSpots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });

  res.json({ Spots: currSpots });
});

// 6. Get spot details from id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;
  const spotById = await Spot.findOne({
    where: {
      id: spotId,
    },
  });

  res.json({ spotById });
});

// 7. Create spot
// require authentication
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const { user } = req;
  const ownerId = user.id;

  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.status(201).json(newSpot);
});

// 8. Add image to spot based on id
// require authentication
// require proper authorization
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { url, preview } = req.body;

  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });
  if (findSpot.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
    });

  const newSpotImg = await SpotImage.create({
    spotId: findSpot.id,
    url,
    preview,
  });

  res.json({
    id: newSpotImg.id,
    url: newSpotImg.url,
    preview: newSpotImg.preview,
  });
});

// 9. Edit spot
// require authentication
// require proper authorization
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const findSpot = await Spot.findByPk(req.params.id);
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });
  if (findSpot.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
    });

  address ? (findSpot.address = address) : findSpot.address;
  city ? (findSpot.city = city) : findSpot.city;
  state ? (findSpot.state = state) : findSpot.state;
  country ? (findSpot.country = country) : findSpot.country;
  lat ? (findSpot.lat = lat) : findSpot.lat;
  lng ? (findSpot.lng = lng) : findSpot.lng;
  name ? (findSpot.name = name) : findSpot.name;
  description ? (findSpot.description = description) : findSpot.description;
  price ? (findSpot.price = price) : findSpot.price;

  await findSpot.save();
  res.json(findSpot);
});

// 10. Delete spot
// require authentication
// require proper authorization
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;

  const findSpot = await Spot.findByPk(req.params.id);
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });
  if (findSpot.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
    });

  await findSpot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

// 12. Get all reviews by spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  const findSpot = await Spot.findOne({ where: { id: spotId } });
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });

  const allReviews = await Review.findAll({
    where: { spotId: spotId },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
  });

  res.json({ Reviews: allReviews });
});

// 13. Add review to spot based on id
// require authentication
router.post(
  "/:spotId/reviews",
  [requireAuth, validateReview],
  async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const { review, stars } = req.body;

    const findSpot = await Spot.findOne({
      where: { id: spotId },
    });
    if (!findSpot)
      return res.status(404).json({ message: "Spot couldn't be found" });

    const reviewCheck = await Review.findOne({
      where: { userId: user.id, spotId: spotId },
    });
    if (reviewCheck)
      return res.status(500).json({
        message: "User already has a review for this spot",
      });

    const newReview = await Review.create({
      userId: user.id,
      spotId: spotId,
      review,
      stars,
    });

    res.status(201).json(newReview);
  }
);

// 18. Get all bookings for spot based on id
// require authentication
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  let bookings;

  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });

  if (findSpot.ownerId === user.id) {
    bookings = await Booking.findAll({
      where: { spotId: spotId },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });
  } else {
    bookings = await Booking.findAll({
      where: { spotId: spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });
  }

  res.json({ Bookings: bookings });
});

// 19. Create booking from spot based on id
// require authentication
// require proper authorization
router.post(
  "/:spotId/bookings",
  [requireAuth, validateDates],
  async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const findSpot = await Spot.findOne({ where: { id: spotId } });
    if (!findSpot)
      return res.status(404).json({ message: "Spot couldn't be found" });
    if (findSpot.ownerId !== user.id)
      return res.status(403).json({
        message: "Forbidden",
      });

    const bookingCheck = await Booking.findOne({
      where: {
        spotId: spotId,
        [Op.and]: [
          { startDate: { [Op.lte]: new Date(startDate) } },
          { endDate: { [Op.gte]: new Date(endDate) } },
        ],
      },
    });
    if (bookingCheck)
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });

    const newBooking = await Booking.create({
      spotId,
      userId: user.id,
      startDate,
      endDate,
    });

    res.json(newBooking);
  }
);

module.exports = router;
