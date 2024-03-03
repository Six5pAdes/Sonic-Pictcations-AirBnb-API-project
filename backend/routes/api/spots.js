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
    .notEmpty()
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
  check("endDate")
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      let givenStartDate = new Date(req.body.startDate);
      let givenEndDate = new Date(value);

      if (givenStartDate >= givenEndDate) {
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
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  page = parseInt(page) || 1;
  size = parseInt(size) || 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;

  let pagination = {
    limit: size,
    offset: size * (page - 1),
  };

  const query = {
    where: {},
  };

  if (minLat && maxLat) {
    query.where.lat = { [Op.between]: [minLat, maxLat] };
  } else if (minLat) {
    query.where.lat = { [Op.gte]: minLat };
  } else if (maxLat) {
    query.where.lat = { [Op.lte]: maxLat };
  }

  if (minLng && maxLng) {
    query.where.lng = { [Op.between]: [minLng, maxLng] };
  } else if (minLng) {
    query.where.lng = { [Op.gte]: minLng };
  } else if (maxLng) {
    query.where.lng = { [Op.lte]: maxLng };
  }

  if (minPrice && maxPrice) {
    query.where.price = { [Op.between]: [minPrice, maxPrice] };
  } else if (minPrice) {
    query.where.price = { [Op.gte]: minPrice };
  } else if (maxPrice) {
    query.where.price = { [Op.lte]: maxPrice };
  }

  const findSpots = await Spot.findAll({
    ...query,
    ...pagination,
  });

  let avgRating;
  for (let index = 0; index < findSpots.length; index++) {
    // average rating info here
    let ratings = await Review.count({
      where: { spotId: findSpots[index].id },
    });
    let stars = await Review.sum("stars", {
      where: { spotId: findSpots[index].id },
    });
    if (!stars) avgRating = 0;
    else avgRating = stars / ratings;
    findSpots[index].dataValues.avgRating =
      avgRating || "No average rating yet";

    let findSpotImg = await SpotImage.findOne({
      where: { spotId: findSpots[index].id, preview: true },
    });
    if (findSpotImg) {
      findSpots[index].dataValues.previewImage = findSpotImg.url;
    } else findSpots[index].dataValues.previewImage = "Image set to private";

    // Convert lat, lng, and price to numbers
    findSpots[index].lat = parseFloat(findSpots[index].lat);
    findSpots[index].lng = parseFloat(findSpots[index].lng);
    findSpots[index].price = parseFloat(findSpots[index].price);

    // Format createdAt and updatedAt
    findSpots[index].createdAt = new Date(
      findSpots[index].createdAt
    ).toLocaleString("se-SE");
    findSpots[index].updatedAt = new Date(
      findSpots[index].updatedAt
    ).toLocaleString("se-SE");
  }

  return res.json({
    Spots: findSpots,
    page: parseInt(page),
    size: parseInt(size),
  });
});

// 5. Get all spots owned by current user
// require authentication
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const currSpot = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });

  let avgRating;
  for (let index = 0; index < currSpot.length; index++) {
    // average rating info here
    let ratings = await Review.count({
      where: { spotId: currSpot[index].id },
    });
    let stars = await Review.sum("stars", {
      where: { spotId: currSpot[index].id },
    });
    if (!stars) avgRating = 0;
    else avgRating = stars / ratings;
    currSpot[index].dataValues.avgRating = avgRating || "No average rating yet";

    let findSpotImg = await SpotImage.findOne({
      where: { spotId: currSpot[index].id, preview: true },
    });
    if (findSpotImg) {
      currSpot[index].dataValues.previewImage = findSpotImg.url;
    } else currSpot[index].dataValues.previewImage = "Image set to private";

    // Convert lat, lng, and price to numbers
    currSpot[index].lat = parseFloat(currSpot[index].lat);
    currSpot[index].lng = parseFloat(currSpot[index].lng);
    currSpot[index].price = parseFloat(currSpot[index].price);

    // Format createdAt and updatedAt
    currSpot[index].createdAt = new Date(
      currSpot[index].createdAt
    ).toLocaleString("se-SE");
    currSpot[index].updatedAt = new Date(
      currSpot[index].updatedAt
    ).toLocaleString("se-SE");
  }

  return res.json({ Spots: currSpot });
});

// 6. Get spot details from id
router.get("/:spotId", async (req, res) => {
  let { spotId } = req.params;

  const spotById = await Spot.findByPk(spotId);
  if (!spotById)
    return res.status(404).json({
      message: "Spot couldn't be found",
    });

  let avgStarRating;
  let numReviews = await Review.count({
    where: { spotId: spotId },
  });
  let stars = await Review.sum("stars", {
    where: { spotId: spotId },
  });
  if (!stars) avgStarRating = 0;
  else avgStarRating = stars / numReviews;
  spotById.dataValues.numReviews = numReviews;
  spotById.dataValues.avgStarRating = avgStarRating;

  const findSpotImg = await SpotImage.findAll({
    where: { spotId: spotId },
    attributes: ["id", "url", "preview"],
  });
  spotById.dataValues.SpotImages = findSpotImg;

  const findOwner = await User.findByPk(spotById.ownerId, {
    attributes: ["id", "firstName", "lastName"],
  });
  spotById.dataValues.Owner = findOwner;

  // Convert lat, lng, and price to numbers
  spotById.lat = parseFloat(spotById.lat);
  spotById.lng = parseFloat(spotById.lng);
  spotById.price = parseFloat(spotById.price);

  // Format createdAt and updatedAt
  spotById.createdAt = new Date(spotById.createdAt).toLocaleString("se-SE");
  spotById.updatedAt = new Date(spotById.updatedAt).toLocaleString("se-SE");

  return res.json(spotById);
});

// 7. Create spot
// require authentication
router.post("/", [requireAuth, validateSpot], async (req, res) => {
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
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    name,
    description,
    price: parseFloat(price),
    createdAt: new Date().toLocaleString("se-SE"),
    updatedAt: new Date().toLocaleString("se-SE"),
  });

  return res.status(201).json(newSpot);
});

// 8. Add image to spot based on id
// require authentication
// require proper authorization
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { user } = req;
  let { spotId } = req.params;
  const { url, preview } = req.body;

  const findSpot = await Spot.findByPk(spotId);
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });
  if (findSpot.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Spot must belong to the current user",
    });

  const newSpotImg = await SpotImage.create({
    spotId: findSpot.id,
    url,
    preview,
  });

  return res.json({
    id: newSpotImg.id,
    url: newSpotImg.url,
    preview: newSpotImg.preview,
  });
});

// 9. Edit spot
// require authentication
// require proper authorization
router.put("/:spotId", [requireAuth, validateSpot], async (req, res) => {
  const { user } = req;
  let { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const findSpot = await Spot.findByPk(spotId);
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });
  if (findSpot.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Spot must belong to the current user",
    });

  if (address) findSpot.address = address;
  if (city) findSpot.city = city;
  if (state) findSpot.state = state;
  if (country) findSpot.country = country;
  if (lat) findSpot.lat = parseFloat(lat);
  if (lng) findSpot.lng = parseFloat(lng);
  if (name) findSpot.name = name;
  if (description) findSpot.description = description;
  if (price) findSpot.price = parseFloat(price);
  if (findSpot) findSpot.createdAt = new Date().toLocaleString("se-SE");
  if (findSpot) findSpot.updatedAt = new Date().toLocaleString("se-SE");

  await findSpot.save();
  return res.json(findSpot);
});

// 10. Delete spot
// require authentication
// require proper authorization
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;
  let { spotId } = req.params;

  const findSpot = await Spot.findByPk(spotId);
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });
  if (findSpot.ownerId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Spot must belong to the current user",
    });

  await findSpot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

// 12. Get all reviews by spot's id
router.get("/:spotId/reviews", async (req, res) => {
  let { spotId } = req.params;

  const findSpot = await Spot.findByPk(spotId);
  if (!findSpot)
    return res.status(404).json({ message: "Spot couldn't be found" });

  const allReviews = await Review.findAll({
    where: { spotId: spotId },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  const results = allReviews.map((review) => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: new Date(review.createdAt).toLocaleString("se-SE"),
    updatedAt: new Date(review.updatedAt).toLocaleString("se-SE"),
    User: review.User,
    ReviewImages: review.ReviewImage,
  }));

  return res.json({ Reviews: results });
});

// 13. Add review to spot based on id
// require authentication
router.post(
  "/:spotId/reviews",
  [requireAuth, validateReview],
  async (req, res) => {
    const { user } = req;
    let { spotId } = req.params;
    const { review, stars } = req.body;

    const findSpot = await Spot.findByPk(spotId);
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
      spotId: parseFloat(spotId),
      review,
      stars: parseFloat(stars),
      createdAt: new Date().toLocaleString("se-SE"),
      updatedAt: new Date().toLocaleString("se-SE"),
    });

    return res.status(201).json(newReview);
  }
);

// 18. Get all bookings for spot based on id
// require authentication
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  let { spotId } = req.params;
  let bookings;

  const findSpot = await Spot.findByPk(spotId);
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

    const results = bookings.map((booking) => ({
      User: booking.User,
      id: booking.id,
      spotId: parseFloat(booking.spotId),
      userId: booking.userId,
      startDate: new Date().toLocaleDateString("se-SE"),
      endDate: new Date().toLocaleDateString("se-SE"),
      createdAt: new Date().toLocaleString("se-SE"),
      updatedAt: new Date().toLocaleString("se-SE"),
    }));

    return res.json({ Bookings: results });
  } else {
    bookings = await Booking.findAll({
      where: { spotId: spotId },
      attributes: ["spotId", "startDate", "endDate"],
    });

    const results = bookings.map((booking) => ({
      spotId: parseFloat(booking.spotId),
      startDate: new Date().toLocaleDateString("se-SE"),
      endDate: new Date().toLocaleDateString("se-SE"),
    }));

    return res.json({ Bookings: results });
  }
});

// 19. Create booking from spot based on id
// require authentication
// require proper authorization
router.post(
  "/:spotId/bookings",
  [requireAuth, validateDates],
  async (req, res) => {
    const { user } = req;
    let { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const findSpot = await Spot.findByPk(spotId);
    if (!findSpot)
      return res.status(404).json({ message: "Spot couldn't be found" });
    if (findSpot.ownerId === user.id)
      return res.status(403).json({
        message: "Forbidden; Spot must NOT belong to the current user",
      });

    const bookingCheck = await Booking.findAll({
      where: {
        spotId: spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
          {
            endDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: new Date(startDate) } },
              { endDate: { [Op.gte]: new Date(endDate) } },
            ],
          },
        ],
      },
    });
    if (bookingCheck.length > 0)
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });

    const newBooking = await Booking.create({
      spotId: parseFloat(spotId),
      userId: user.id,
      startDate: new Date(startDate).toLocaleDateString("se-SE"),
      endDate: new Date(endDate).toLocaleDateString("se-SE"),
      createdAt: new Date().toLocaleString("se-SE"),
      updatedAt: new Date().toLocaleString("se-SE"),
    });

    return res.json(newBooking);
  }
);

module.exports = router;
