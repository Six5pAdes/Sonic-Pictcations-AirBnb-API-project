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
          url: "https://soahcity.com/wp-content/uploads/2015/04/sweet-mountain-high-resolution-screen-4.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://www.models-resource.com/resources/big_icons/2/1203.png?updated=1474423727",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://cdn.staticneo.com/w/sonic/thumb/Sweet_Mountain.png/300px-Sweet_Mountain.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://d.wattpad.com/story_parts/834841742/images/15f003f20de07709407152262888.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.pinimg.com/originals/0f/d8/b6/0fd8b66db09e252b8db8ab0633f4c73f.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://www.intrepidtravel.com/adventures/wp-content/uploads/2017/09/iStock-485256585-e1506281687905.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://www.speedrun.com/static/theme/9wx4eer5/background.jpg?v=d8eee53",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://images.gamebanana.com/img/ss/requests/5a8a16c01f774.webp",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://images.gamebanana.com/img/ss/mods/61c55f68bfbdc.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://images.gamebanana.com/img/ss/mods/5befcf55e41be.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://steamuserimages-a.akamaihd.net/ugc/915794306417894464/D0987D6A723226CC9EEC15753A23B7AB672F1FD1/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://cdnb.artstation.com/p/assets/images/images/054/458/025/large/robert-bishop-ark-render.jpg?1664574946",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://64.media.tumblr.com/2ed6a3e6835eb52fac16780b7a75e0e3/b42f32250efdaa28-65/s1280x1920/9b49aa1bd40936b2e3fc24b32f66ac70fabd48ae.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://pbs.twimg.com/media/EolTDsAXEAMJ0SY.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://tcrf.net/images/6/65/SonicAdventure2Battle_MissionStreetBG.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRh-DkUwlYN2xT4ue1ceItZe97Jhvpt9Z3Qg&usqp=CAU",
          preview: true,
        },
        {
          spotId: 7,
          url: "http://dioxaz.free.fr/tlfz/decors/sa2/musicplantbg01.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://44.media.tumblr.com/ea29506c67c3e4d6215aebef45b5ae44/6bbab52bab6cd8e4-ff/s500x750_f1/4b09a51df32b57b1331f23ad80f7b613bd2993eb.gif",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://i.pinimg.com/originals/1d/38/3f/1d383fa69970eeb4252e1374c0cb92c7.jpg",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://images.gamebanana.com/img/ss/mods/61eec952d99bb.jpg",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://img.freepik.com/free-photo/silhouette-skyscrapers-illuminate-city-skyline-sunset-generated-by-ai_24640-91512.jpg?size=626&ext=jpg&ga=GA1.1.2082370165.1710720000&semt=ais",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://64.media.tumblr.com/tumblr_m1dc13umYi1qdtw9eo1_540.png",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://www.anywhere.com/blog/images/1-Vz3Fnd0FX-uDW_iXYGZvzQ-1024x683.jpeg",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://sega-addicts.com/wp-content/uploads/2015/09/mystic-ruins.jpg",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://dcmods.unreliable.network/owncloud/data/PiKeyAr/files/Dreamcastify/Mystic%20Ruins/FallDay_DC.png",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://pbs.twimg.com/tweet_video_thumb/E0RGVCWWQAA0zlp.jpg",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://iili.io/JX1mVnV.png",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://pbs.twimg.com/media/Ff3LFMiUoAE1T3Q?format=jpg&name=large",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://retrocdn.net/images/thumb/7/7d/Sonic_Frontiers_Announcement_Screenshots_04.png/320px-Sonic_Frontiers_Announcement_Screenshots_04.png",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://images4.alphacoders.com/119/1196181.jpg",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://www.jaxon.gg/wp-content/uploads/2022/11/scf138-1024x576.jpg",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://iili.io/JX1mVnV.png",
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
