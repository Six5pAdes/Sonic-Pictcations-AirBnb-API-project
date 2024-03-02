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
          address: "Sumitomo Fudosan Osaki Garden Tower 9F",
          city: "Shinagawa",
          state: "Tokyo",
          country: "Japan",
          lat: -54.98887,
          lng: 159.23926,
          name: "Sweet Mountain",
          description:
            "Planet formerly occupied by the Eggman Empire, aesthetically decadent.",
          price: 7741,
        },
        {
          ownerId: 2,
          address: "Adela Balboa, No. 3",
          city: "Parla",
          state: "Madrid",
          country: "Spain",
          lat: 82.53947,
          lng: 30.71419,
          name: "Adabat",
          description: "Floating village situated in Southeast Asia.",
          price: 2595,
        },
        {
          ownerId: 3,
          address: "15 Old Bond Street",
          city: "Mayfair",
          state: "London",
          country: "England",
          lat: -88.35338,
          lng: -34.12504,
          name: "Metal City",
          description: "Sleek urban city, perfect for street races.",
          price: 474,
        },
        {
          ownerId: 4,
          address: "410-420 Rayners Lane",
          city: "Pinner",
          state: "Middlesex",
          country: "England",
          lat: -65.17361,
          lng: -112.89971,
          name: "Sunset Heights",
          description:
            "Quaint little town painted in hues of the sunset, still recovering from the Eggman Empire's invasion.",
          price: 108,
        },
        {
          ownerId: 5,
          address: "Unit 2 Industrial Estate, Leigh Close",
          city: "New Malden",
          state: "Surrey",
          country: "England",
          lat: 57.47794,
          lng: 36.61117,
          name: "Space Colony ARK",
          description:
            "Top secret research center in Earth's exosphere, currently abandoned following a government shutdown.",
          price: 52,
        },
        {
          ownerId: 6,
          address: "573 Forbes Blvd",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 38.59157,
          lng: -8.68926,
          name: "Radical Highway",
          description:
            "City of the night, complete with its own version of the Golden Gate bridge.",
          price: 32,
        },
        {
          ownerId: 7,
          address: "8401 Aero Drive",
          city: "San Diego",
          state: "California",
          country: "United States of America",
          lat: -55.82188,
          lng: 47.84054,
          name: "Music Plant",
          description:
            "Extravagant stage with architecture themed after musical instruments.",
          price: 70,
        },
        {
          ownerId: 8,
          address: "1990 Janice Avenue",
          city: "Melrose Park",
          state: "Illinois",
          country: "United States of America",
          lat: 18.11537,
          lng: 77.83593,
          name: "Coral Cave",
          description:
            "Underground grotto with a plentiful amount of gleaming crystals, previously a site for mining.",
          price: 63,
        },
        {
          ownerId: 9,
          address: "2550 Santa Fe Avenue",
          city: "Redondo Beach",
          state: "California",
          country: "United States of America",
          lat: -4.48728,
          lng: 76.61139,
          name: "Crisis City",
          description:
            "Metropolis of the future, under siege by a pseudo-deity of fire and destruction.",
          price: 48,
        },
        {
          ownerId: 10,
          address: "27 Great West Rd",
          city: "Brentford",
          state: "London",
          country: "England",
          lat: 44.89953,
          lng: 20.33997,
          name: "Mystic Ruins",
          description:
            "Jungle area bearing resemblance to the Amazon and Aztec ruins, one portion of land ascended to the sky becoming Angel Island.",
          price: 89,
        },
        {
          ownerId: 11,
          address: "Hanedakuko",
          city: "Ota City",
          state: "Tokyo",
          country: "Japan",
          lat: 35.33122,
          lng: 139.46525,
          name: "Final Egg",
          description:
            "One out of many bases under the Eggman Empire, a sky-piercing tower acting as an eyesore in the Mystic Ruins.",
          price: 19,
        },
        {
          ownerId: 1,
          address: "140 Progress",
          city: "Irvine",
          state: "California",
          country: "United States of America",
          lat: 78.80455,
          lng: 9.92618,
          name: "Kronos Island",
          description:
            "One of the five Starfall Islands, an ancient civilization once inhabited this grand location.",
          price: 49,
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
    await queryInterface.bulkDelete(
      options,
      {
        country: {
          [Op.in]: ["Japan", "Spain", "England", "United States of America"],
        },
      },
      {}
    );
  },
};
