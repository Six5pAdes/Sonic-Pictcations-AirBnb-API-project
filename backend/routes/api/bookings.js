const express = require("express");

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

  res.json({ Bookings: allBookings });
});

// 20. Edit booking
// require authentication
// require proper authorization
router.put("/:bookingId", requireAuth, validateDates, async (req, res) => {
  const { user } = req;
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  const findBooking = await Booking.findOne({
    where: { id: bookingId },
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
  const { bookingId } = req.params;

  const findBooking = await Booking.findOne({ where: { id: bookingId } });

  await findBooking.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
