'use strict';

const { Faker, de_AT, de, en, base } = require('@faker-js/faker');
const faker = new Faker({ locale: [de_AT, de, en, base] });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     * Example:
     */
     for (let i = 0; i < 41; i++) {

      if(i>=0 && i<=19){
          await queryInterface.bulkInsert('Statistics', [{
            views: faker.number.int({ min: 1, max: 200 }),
            contacts: faker.number.int({ min: 1, max: 200 }),
            bookId: i+1,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }], {});
      }
      if(i>=20 && i<=39){

          await queryInterface.bulkInsert('Statistics', [{
            views: faker.number.int({ min: 1, max: 200 }),
            contacts: faker.number.int({ min: 1, max: 200 }),
            bookId: i+1,
            userId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          }], {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     * Example:
     */
    await queryInterface.bulkDelete('Statistics', null, {});

  }
};
