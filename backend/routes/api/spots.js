const express = require("express");
const Op = require("sequelize");

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

// 4. Get all spots
router.get("/", async (req, res) => {
  // 24. add query filters to get all spots
  const allSpots = await Spot.findAll({
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
    ],
  });

  res.json({ Spots: allSpots });
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
router.post("/", requireAuth, async (req, res) => {
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
router.put("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.findOne({ where: { id: spotId } });

  address ? (spot.address = address) : spot.address;
  city ? (spot.city = city) : spot.city;
  state ? (spot.state = state) : spot.state;
  country ? (spot.country = country) : spot.country;
  lat ? (spot.lat = lat) : spot.lat;
  lng ? (spot.lng = lng) : spot.lng;
  name ? (spot.name = name) : spot.name;
  description ? (spot.description = description) : spot.description;
  price ? (spot.price = price) : spot.price;

  await spot.save();
  res.json(spot);
});

// 10. Delete spot
// require authentication
// require proper authorization
router.delete("/:spotId", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;

  const spot = await Spot.findOne({ where: { id: spotId } });

  await spot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

// 12. Get all reviews by spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({ where: { id: spotId } });

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
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });
  const newReview = await Review.create({
    userId: user.id,
    spotId: spotId,
    review,
    stars,
  });

  res.status(201).json(newReview);
});

// 18. Get all bookings for spot based on id
// require authentication
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  let bookings;

  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });

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
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  const newBooking = await Booking.create({
    spotId,
    userId: user.id,
    startDate,
    endDate,
  });

  res.json(newBooking);
});

module.exports = router;
