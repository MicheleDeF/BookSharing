'use strict';

const { Faker, de_AT, de, en, base } = require('@faker-js/faker');
const faker = new Faker({ locale: [de_AT, de, en, base] });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     * Example:
     */
    for (let index = 46; index < 48; index++) {
      
       await queryInterface.bulkInsert('Statistics', [{
        views: faker.number.int({ min: 1, max: 200 }),
        contacts: faker.number.int({ min: 1, max: 200 }),
        bookId: index,
        userId: 6,
        createdAt: new Date(),
        updatedAt: new Date()  
      }], {});
      
    }

    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     * Example:
     */
     await queryInterface.bulkDelete('Statistics', null, {});
    
  }
};
