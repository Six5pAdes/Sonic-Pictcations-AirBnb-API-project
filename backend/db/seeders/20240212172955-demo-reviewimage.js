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
          url: "https://info.sonicretro.org/images/thumb/3/33/Sonic_Pict_2019-09-23.jpg/300px-Sonic_Pict_2019-09-23.jpg",
        },
        {
          reviewId: 2,
          url: "https://pbs.twimg.com/media/FRYs8zyagAEWRF8?format=jpg&name=medium",
        },
        {
          reviewId: 3,
          url: "https://64.media.tumblr.com/3f37ec0b02bde37cbee05f4b849bcf1f/c1bbad97c61c4657-39/s500x750/73c1c4951265b109c9715d556676993f06718b00.jpg",
        },
        {
          reviewId: 4,
          url: "https://i.pinimg.com/originals/da/90/ae/da90ae230e60ea0d1fb0a90f335c6476.jpg",
        },
        {
          reviewId: 5,
          url: "https://c4.wallpaperflare.com/wallpaper/513/931/678/sonic-sonic-the-hedgehog-shadow-the-hedgehog-maria-sega-hd-wallpaper-preview.jpg",
        },
        {
          reviewId: 6,
          url: "https://www.sonicstadium.org/uploads/monthly_2023_04/2023-may-pict.jpeg.5d56f3b4e157c129fea284df590a45a4.jpeg",
        },
        {
          reviewId: 7,
          url: "https://sonic-city.net/wp-content/uploads/2024/02/image-205-400x200.png",
        },
        {
          reviewId: 8,
          url: "https://sonic-city.net/wp-content/uploads/2023/08/image-74.png",
        },
        {
          reviewId: 9,
          url: "https://pbs.twimg.com/media/Fd2_RanVsAA2CWK.jpg:large",
        },
        {
          reviewId: 10,
          url: "https://pbs.twimg.com/media/Euy_JUnVEAE0ByM?format=jpg&name=medium",
        },
        {
          reviewId: 11,
          url: "https://static1.thegamerimages.com/wordpress/wp-content/uploads/2022/12/sonic-frontiers-sage-eggman.jpg",
        },
        {
          reviewId: 12,
          url: "https://c4.wallpaperflare.com/wallpaper/281/771/582/sonic-sega-pc-gaming-sonic-frontiers-video-game-art-hd-wallpaper-thumb.jpg",
        },
        {
          reviewId: 13,
          url: "https://m.media-amazon.com/images/M/MV5BZGI0NDM1ODMtZjA1Ni00MTdmLWE4MTQtOGNjZmMzY2NmN2E1XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg",
        },
        {
          reviewId: 14,
          url: "https://pbs.twimg.com/media/GGjCv7oWwAA6d2w?format=jpg&name=4096x4096",
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
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
      },
      {}
    );
  },
};
