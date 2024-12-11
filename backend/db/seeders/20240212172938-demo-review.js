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
          userId: 4,
          review:
            "The food here is okay. I'm glad Sonic gave me the recommendation, but a lot of stuff here is too sweet, even for my sweet tooth. It doesn't help that Eggman's influence is still here.",
          stars: 2,
        },
        {
          spotId: 2,
          userId: 3,
          review:
            "I enjoy flying here in the spring. Their grape candies are the best.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 6,
          review:
            "The city is nice and all, but there are no treasures here. Just some empty modern architecture. Nonetheless, I wouldn't mind vacationing here while on a 'business trip.' 😘",
          stars: 1,
        },
        {
          spotId: 4,
          userId: 10,
          review:
            "You can fish here without worrying about those scary robots.",
          stars: 3,
        },
        {
          spotId: 5,
          userId: 11,
          review:
            "My grandfather's best work was done here. If only I could have met him, as well as Maria.",
          stars: 4,
        },
        {
          spotId: 6,
          userId: 8,
          review:
            "I must admit, the night sky here is indeed beautiful. I can still see the moon even with all of the light and noise pollution.",
          stars: 4,
        },
        {
          spotId: 7,
          userId: 9,
          review:
            "This place is so much fun! I can see why Cream enjoys coming here!",
          stars: 4,
        },
        {
          spotId: 8,
          userId: 7,
          review:
            "Thank you, Ms. Blaze, for giving me the chance to come here! I can't wait to come back again soon!",
          stars: 5,
        },
        {
          spotId: 9,
          userId: 5,
          review:
            "I see in spite of our efforts, this place is still fragmented. But I know that with time, it will be whole again.",
          stars: 1,
        },
        {
          spotId: 10,
          userId: 1,
          review: "Big sure knows how to make a place feel like home.",
          stars: 5,
        },
        {
          spotId: 11,
          userId: 12,
          review:
            "Father is the utmost genius. I cannot wait to see what he has in store for the future.",
          stars: 5,
        },
        {
          spotId: 12,
          userId: 4,
          review:
            "Amazing place to visit. I just wish I could forget my time here and re-experience it for the first time with a physical body.",
          stars: 4,
        },
        {
          spotId: 13,
          userId: 1,
          review:
            "I really enjoyed running around on this island. Maybe someday, I'll come back again.",
          stars: 3,
        },
        {
          spotId: 14,
          userId: 2,
          review:
            "This place was where I decided to start anew. I'm glad I did.",
          stars: 5,
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
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
      },
      {}
    );
  },
};
