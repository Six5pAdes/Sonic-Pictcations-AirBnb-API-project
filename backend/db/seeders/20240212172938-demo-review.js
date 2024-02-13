"use strict";

const { Review } = require("../models");

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
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          review: "This one waitress mixed up my order.",
          stars: 2,
        },
        {
          spotId: 2,
          userId: 2,
          review: "These pretzels made me thirsty, not exactly sponge-worthy.",
          stars: 3,
        },
        {
          spotId: 3,
          userId: 3,
          review: "This is the Bad Place!",
          stars: 1,
        },
        {
          spotId: 4,
          userId: 4,
          review: "Chills, literal chills.",
          stars: 5,
        },
        {
          spotId: 5,
          userId: 5,
          review: "History of TV is made here.",
          stars: 4,
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
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 2, 3, 4, 5],
      },
    }, {});
  },
};
