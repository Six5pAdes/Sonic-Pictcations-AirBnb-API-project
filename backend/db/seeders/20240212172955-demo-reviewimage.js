"use strict";

const { ReviewImage } = require("../models");

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
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "https://static.wikia.nocookie.net/sonic/images/c/c8/SonicChannel_SweetMountain.jpg/revision/latest?cb=20200707094254",
        },
        {
          reviewId: 2,
          url: "https://static.wikia.nocookie.net/sonic/images/0/05/Sonic_Channel_April.jpg/revision/latest?cb=20220428192526",
        },
        {
          reviewId: 3,
          url: "https://static.wikia.nocookie.net/sonic/images/1/11/Sonic_Channel_March_2022.jpg/revision/latest?cb=20220324231614",
        },
        {
          reviewId: 4,
          url: "https://static.wikia.nocookie.net/sonic/images/3/35/Sonic_Channel_2021_Amy.jpg/revision/latest?cb=20220805235221",
        },
        {
          reviewId: 5,
          url: "https://static.wikia.nocookie.net/sonic/images/c/ca/Sonic_Channel_Tanabata_2020.jpg/revision/latest?cb=20230117130439",
        },
        {
          reviewId: 6,
          url: "https://static.wikia.nocookie.net/sonic/images/2/20/Sonic_PICT_May_2023.jpg/revision/latest?cb=20230428225608",
        },
        {
          reviewId: 7,
          url: "https://static.wikia.nocookie.net/sonic/images/5/56/SCSonicPictFeb24.jpg/revision/latest?cb=20240226080231",
        },
        {
          reviewId: 8,
          url: "https://static.wikia.nocookie.net/sonic/images/1/18/SonicPICTAugust2023.jpg/revision/latest?cb=20230910191816",
        },
        {
          reviewId: 9,
          url: "https://static.wikia.nocookie.net/sonic/images/4/46/Silver_In_The_Bad_Future.jpg/revision/latest?cb=20220929233129",
        },
        {
          reviewId: 10,
          url: "https://static.wikia.nocookie.net/sonic/images/6/61/Sonic_Channel_Cat_Day_2021.jpg/revision/latest?cb=20210222062541",
        },
        {
          reviewId: 11,
          url: "https://static.wikia.nocookie.net/sonic/images/3/32/SCSageChristmas.jpg/revision/latest?cb=20221223020444",
        },
        {
          reviewId: 12,
          url: "https://static.wikia.nocookie.net/sonic/images/a/a5/SC_Frontiers_November2022.jpg/revision/latest?cb=20221124002012",
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
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        reviewId: {
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
      },
      {}
    );
  },
};
