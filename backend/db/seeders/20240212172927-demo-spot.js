"use strict";

const { Spot } = require("../models");

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
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "10479 Chord Boulevard",
          city: "Gold Coast",
          state: "Queensland",
          country: "Australia",
          lat: -54.98887,
          lng: 159.23926,
          name: "Central Perk",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          price: 7741,
        },
        {
          ownerId: 2,
          address: "8778 Curriculum Avenue",
          city: "Imphal",
          state: "Manipur",
          country: "India",
          lat: 82.53947,
          lng: 30.71419,
          name: "Seinfeld Apartment",
          description: "Nulla facilisi etiam dignissim diam.",
          price: 2595,
        },
        {
          ownerId: 3,
          address: "148 Passive Street",
          city: "San Pedro Pochutla",
          state: "Oaxaca",
          country: "Mexico",
          lat: -88.35338,
          lng: -34.12504,
          name: "Good Place",
          description: "In vitae turpis massa sed elementum tempus egestas.",
          price: 474,
        },
        {
          ownerId: 4,
          address: "97 Fold Lane",
          city: "Lagos",
          state: "Lagos",
          country: "Nigeria",
          lat: -65.17361,
          lng: -112.89971,
          name: "Police District 99",
          description:
            "Pulvinar neque laoreet suspendisse interdum consectetur libero.",
          price: 108,
        },
        {
          ownerId: 5,
          address: "6 Occupy Drive",
          city: "Jacksonville",
          state: "Florida",
          country: "United States of America",
          lat: 57.47794,
          lng: 36.61117,
          name: "30 Rockefeller Plaza",
          description:
            "Vulputate eu scelerisque felis imperdiet proin fermentum leo vel.",
          price: 52,
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
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        country: {
          [Op.in]: [
            "Australia",
            "India",
            "Mexico",
            "Nigeria",
            "United States of America",
          ],
        },
      },
      {}
    );
  },
};
