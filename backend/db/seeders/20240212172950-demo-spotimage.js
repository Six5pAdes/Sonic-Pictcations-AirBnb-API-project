"use strict";

const { SpotImage } = require("../models");

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
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://static.wikia.nocookie.net/sonic/images/7/7d/Sweet_mountain_2.png/revision/latest?cb=20160831111912",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://static.wikia.nocookie.net/sonic/images/a/a1/Chilianddiphangin_out.jpg/revision/latest?cb=20160828172010",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://static.wikia.nocookie.net/sonic/images/4/42/Metal-city-sonic-riders_%282%29.png/revision/latest?cb=20200110155636",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://static.wikia.nocookie.net/sonic/images/a/a2/SFpromo1.jpg/revision/latest?cb=20170826065109",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://static.wikia.nocookie.net/sonic/images/c/cc/Space_Colony_ARK_encapsuled.png/revision/latest?cb=20140714184228",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://static.wikia.nocookie.net/sonic/images/a/ae/RADICALHIGHWAYGC14.png/revision/latest?cb=20170520114855",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://static.wikia.nocookie.net/sonic/images/b/b7/Sonic_Advance_2_21.png/revision/latest?cb=20130901000622",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://static.wikia.nocookie.net/sonic/images/9/91/Coralcave.1.JPG/revision/latest?cb=20120628230927",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://static.wikia.nocookie.net/sonic/images/c/c1/Crisis_city4.JPG/revision/latest?cb=20170807092550",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://static.wikia.nocookie.net/sonic/images/0/06/Mystic-Ruins-Sonic-Adventure.png/revision/latest?cb=20231020143050",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://static.wikia.nocookie.net/sonic/images/f/f4/Sonic_Adventure_DX_Final_Egg_outside.png/revision/latest?cb=20220328030519",
          preview: false,
        },
        {
          spotId: 12,
          url: "https://static.wikia.nocookie.net/sonic/images/6/6f/SFSBKronosIslandPodiumBG.png/revision/latest?cb=20221119213901",
          preview: true,
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
    options.tableName = "SpotImages";
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
