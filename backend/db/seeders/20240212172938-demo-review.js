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
          review:
            "The food here is great, need to bring Amy next time. Only reason for this rating is cause of Egghead's buildings still here. Remind me to destroy them later.",
          stars: 2,
        },
        {
          spotId: 2,
          userId: 2,
          review:
            "I enjoy flying here in the spring. Their mint-covered coconut candies are the best.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 3,
          review:
            "It's great to come out here and ride the air without having to worry about birds or bots.",
          stars: 1,
        },
        {
          spotId: 4,
          userId: 4,
          review:
            "This place is so beautiful. Over time, you won't even tell that Eggman attacked here.",
          stars: 3,
        },
        {
          spotId: 5,
          userId: 5,
          review:
            "I remember countless nights stargazing with Maria. Whatever it takes to make her happy.",
          stars: 4,
        },
        {
          spotId: 6,
          userId: 6,
          review:
            "I spend half my working vacations here. The night is bustling, and gems galore to grasp.",
          stars: 4,
        },
        {
          spotId: 7,
          userId: 7,
          review:
            "This place is so nice! I need to come back here with Mr. Sonic and Ms. Rose next time!",
          stars: 4,
        },
        {
          spotId: 8,
          userId: 8,
          review:
            "I am the master of fire, but even I enjoy a dip in the water.",
          stars: 3,
        },
        {
          spotId: 9,
          userId: 9,
          review:
            "This world I live in can be changed, I will not rest until Iblis is gone and this city teems with life once more.",
          stars: 1,
        },
        {
          spotId: 10,
          userId: 10,
          review: "Fishing, napping, what more can I ask for?",
          stars: 5,
        },
        {
          spotId: 11,
          userId: 11,
          review:
            "The perfect home away from home made better with Sage's presence.",
          stars: 5,
        },
        {
          spotId: 12,
          userId: 1,
          review:
            "Amazing place to visit, if only I got to come for the first time under better circumstances.",
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
