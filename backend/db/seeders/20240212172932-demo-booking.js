"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2024-02-28",
        endDate: "2024-02-29",
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2024-05-17",
        endDate: "2024-06-01",
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2024-03-03",
        endDate: "2024-04-02",
      },
      {
        spotId: 4,
        userId: 4,
        startDate: "2024-08-05",
        endDate: "2024-08-10",
      },
      {
        spotId: 5,
        userId: 5,
        startDate: "2024-11-30",
        endDate: "2024-12-06",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 2, 3, 4, 5],
      },
    });
  },
};
