'use strict';

const { Faker, it, de_AT, de, en, base } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const faker = new Faker({ locale: [it, de_AT, de, en, base] });

/** Camposano, Napoli, Campania, 80035, Italia */
const userLat = 40.949282740897054;
const userLng = 14.523030645794485;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 2; i++) {

      const password = "a1s2d3F4";
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const province = faker.location.state({ abbreviated: true });
      const zipcode = faker.location.zipCode();

      if(i==0){

          await queryInterface.bulkInsert('Users', [{
            lastName: faker.person.lastName(),
            firstName: faker.person.firstName(),
            description: faker.lorem.sentence(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            password_hash: passwordHash,
            address: `${street}, ${zipcode} ${city} (${province})`,
            radius: '500',
            lon: userLng,
            lat: userLat,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});

      }else{

              await queryInterface.bulkInsert('Users', [{
                lastName: faker.person.lastName(),
                firstName: faker.person.firstName(),
                description: faker.lorem.sentence(),
                email: faker.internet.email(),
                avatar: faker.image.avatar(),
                password_hash: passwordHash,
                address: `${street}, ${zipcode} ${city} (${province})`,
                radius: '500',
                lon: userLng + 0.00045,
                lat: userLat + 0.00045,
                createdAt: new Date(),
                updatedAt: new Date()
            }], {});
      }
    }    
  },

  async down (queryInterface, Sequelize) {  
    await queryInterface.bulkDelete('Users', null, {});
    
  }
};
