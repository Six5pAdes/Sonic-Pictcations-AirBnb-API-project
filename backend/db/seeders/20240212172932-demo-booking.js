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
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 4,
          startDate: "2024-02-28",
          endDate: "2024-02-29",
        },
        {
          spotId: 2,
          userId: 3,
          startDate: "2024-05-17",
          endDate: "2024-06-01",
        },
        {
          spotId: 3,
          userId: 6,
          startDate: "2024-03-03",
          endDate: "2024-04-02",
        },
        {
          spotId: 4,
          userId: 10,
          startDate: "2024-08-05",
          endDate: "2024-08-10",
        },
        {
          spotId: 5,
          userId: 11,
          startDate: "2024-11-30",
          endDate: "2024-12-06",
        },
        {
          spotId: 6,
          userId: 8,
          startDate: "2023-04-29",
          endDate: "2023-05-05",
        },
        {
          spotId: 7,
          userId: 9,
          startDate: "2024-02-14",
          endDate: "2024-02-21",
        },
        {
          spotId: 8,
          userId: 7,
          startDate: "2024-06-15",
          endDate: "2024-08-01",
        },
        {
          spotId: 9,
          userId: 5,
          startDate: "2024-09-01",
          endDate: "2024-09-30",
        },
        {
          spotId: 10,
          userId: 1,
          startDate: "2025-02-22",
          endDate: "2025-02-26",
        },
        {
          spotId: 11,
          userId: 12,
          startDate: "2024-12-10",
          endDate: "2024-12-16",
        },
        {
          spotId: 12,
          userId: 4,
          startDate: "2022-11-30",
          endDate: "2022-12-06",
        },
        {
          spotId: 13,
          userId: 1,
          startDate: "2024-02-29",
          endDate: "2024-03-01",
        },
        {
          spotId: 14,
          userId: 2,
          startDate: "2024-03-17",
          endDate: "2024-03-21",
        },
      ],
      { validate: true }
    );
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
    await queryInterface.bulkDelete(
      options,
      {
        spotId: {
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
      },
      {}
    );
  },
};
