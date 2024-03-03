const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Booking, Spot, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

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

// 17. Get all belongings of current user
// require authentication
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const allBookings = await Booking.findAll({
    where: { userId: user.id },
    include: {
      model: Spot,
      attributes: {
        exclude: ["description", "createdAt", "updatedAt"],
      },
    },
  });

  for (let index = 0; index < allBookings.length; index++) {
    let thisBooking = allBookings[index].toJSON();

    let findSpotImg = await SpotImage.findOne({
      where: { spotId: thisBooking.Spot.id, preview: true },
    });

    if (findSpotImg) {
      thisBooking.Spot.previewImage = findSpotImg.url;
    } else thisBooking.Spot.previewImage = "Image set to private";
    allBookings[index] = thisBooking;
  }

  const results = allBookings.map((booking) => ({
    id: booking.id,
    spotId: booking.spotId,
    Spot: {
      id: booking.Spot.id,
      ownerId: booking.Spot.ownerId,
      address: booking.Spot.address,
      city: booking.Spot.city,
      state: booking.Spot.state,
      country: booking.Spot.country,
      lat: parseFloat(booking.Spot.lat),
      lng: parseFloat(booking.Spot.lng),
      name: booking.Spot.name,
      price: parseFloat(booking.Spot.price),
      previewImage: booking.Spot.previewImage,
    },
    userId: booking.userId,
    startDate: new Date(booking.startDate).toLocaleDateString("sv-SE"),
    endDate: new Date(booking.endDate).toLocaleDateString("sv-SE"),
    createdAt: new Date(booking.createdAt).toLocaleString("sv-SE"),
    updatedAt: new Date(booking.updatedAt).toLocaleString("sv-SE"),
  }));

  res.json({ Bookings: results });
});

// 20. Edit booking
// require authentication
// require proper authorization
router.put("/:bookingId", [requireAuth, validateDates], async (req, res) => {
  const { user } = req;
  let { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  const findBooking = await Booking.findByPk(bookingId);
  if (!findBooking)
    return res.status(404).json({ message: "Booking couldn't be found" });
  if (findBooking.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden; Booking must belong to the current user",
    });

  let currDate = new Date();
  if (new Date(endDate) < currDate) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  const bookingCheck = await Booking.findAll({
    where: {
      spotId: findBooking.spotId,
      [Op.or]: [
        {
          startDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
        },
        { endDate: { [Op.between]: [new Date(startDate), new Date(endDate)] } },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: new Date(startDate) } },
            { endDate: { [Op.gte]: new Date(endDate) } },
          ],
        },
      ],
      id: { [Op.ne]: bookingId },
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

  if (startDate)
    findBooking.startDate = new Date(startDate).toLocaleDateString("sv-SE");
  if (endDate)
    findBooking.endDate = new Date(endDate).toLocaleDateString("sv-SE");
  findBooking.createdAt = new Date().toLocaleString("sv-SE");
  findBooking.updatedAt = new Date().toLocaleString("sv-SE");

  await findBooking.save();
  res.json(findBooking);
});

// 21. Delete booking
// require authentication
// require proper authorization
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { user } = req;
  let { bookingId } = req.params;

  const findBooking = await Booking.findOne({
    where: { id: bookingId },
  });
  if (!findBooking)
    return res.status(404).json({ message: "Booking couldn't be found" });

  if (user.id === findBooking.userId) {
    if (new Date(findBooking.startDate) <= new Date()) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
      });
    }

    await findBooking.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } else {
    return res.status(403).json({
      message:
        "Forbidden; Booking must belong to the current user, or Spot must belong to the current user",
    });
  }
});

module.exports = router;
