const express = require("express");
const { Op } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Booking, Spot } = require("../../db/models");

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
        return false;
      }
      return true;
    })
    .withMessage("startDate cannot be in the past"),
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((value, { req }) => {
      let givenStartDate = new Date(req.body.startDate);
      let givenEndDate = new Date(value);

      if (givenStartDate <= givenEndDate) {
        return false;
      }
      return true;
    })
    .withMessage("endDate cannot be on or before startDate"),
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
    let findSpotImg = await SpotImage.findOne({
      where: { spotId: allBookings[index].Spot.id, preview: true },
    });

    if (findSpotImg) {
      allBookings[index].Spot.dataValues.previewImage = findSpotImg.url;
    } else allBookings[index].Spot.dataValues.previewImage = null;
  }

  res.json({ Bookings: allBookings });
});

// 20. Edit booking
// require authentication
// require proper authorization
router.put("/:bookingId", requireAuth, validateDates, async (req, res) => {
  const { user } = req;
  const { startDate, endDate } = req.body;

  const findBooking = await Booking.findByPk(req.params.id);
  if (!findBooking)
    return res.status(404).json({ message: "Booking couldn't be found" });
  if (findBooking.userId !== user.id)
    return res.status(403).json({
      message: "Forbidden",
    });

  if (new Date(endDate) < new Date()) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  const bookingCheck = await Booking.findOne({
    where: {
      id: { [Op.ne]: bookingId },
      spotId: findBooking.spotId,
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

  startDate ? (findBooking.startDate = startDate) : findBooking.startDate;
  endDate ? (findBooking.endDate = endDate) : findBooking.endDate;

  await findBooking.save();
  res.json(findBooking);
});

// 21. Delete booking
// require authentication
// require proper authorization
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { user } = req;

  const findBooking = await Booking.findByPk(req.params.id);
  if (!findBooking)
    return res.status(404).json({ message: "Booking couldn't be found" });

  const findSpot = await Spot.findOne({ where: { id: findBooking.spotId } });
  if (user.id === findBooking.userId || user.id === findSpot.ownerId) {
    if (newDate(findBooking.startDate) <= new Date()) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
      });
    }

    await findBooking.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = router;
