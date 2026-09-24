'use strict';

const { Faker, de_AT, de, en, base } = require('@faker-js/faker');
const faker = new Faker({ locale: [de_AT, de, en, base] });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
       
     for (let i = 0; i < 2; i++) {

        if( i==0 ){

            await queryInterface.bulkInsert('Messages', [{
                  content: faker.commerce.productDescription(),
                  senderId: faker.number.int({ min: 1, max: 1 }),
                  recipientId: faker.number.int({ min: 2, max: 2 }),
                  isRead: false,
                  createdAt: new Date(),
                  updatedAt: new Date()  
               }], {});

        }else{
            await queryInterface.bulkInsert('Messages', [{
                  content: faker.commerce.productDescription(),
                  senderId: faker.number.int({ min: 2, max: 2 }),
                  recipientId: faker.number.int({ min: 1, max: 1 }),
                  isRead: false,
                  createdAt: new Date(),
                  updatedAt: new Date()  
               }], {});

        }

    }    
  },
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
     await queryInterface.bulkDelete('Messages', null, {});
     
  }
};
