'use strict';

const { Faker, it, de_AT, de, en, base } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const faker = new Faker({ locale: [it, de_AT, de, en, base] });

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 5; i++) {

      const password = "a1s2d3F4";
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const province = faker.location.state({ abbreviated: true });
      const zipcode = faker.location.zipCode();

      await queryInterface.bulkInsert('Users', [{
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        description: faker.lorem.sentence(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password_hash: passwordHash,
        address: `${street}, ${zipcode} ${city} (${province})`,
        radius: '1.500',
        lon: faker.location.longitude({max: 15, min: 14 }),
        lat: faker.location.latitude({ max: 41, min: 40 }),
        createdAt: new Date(),
        updatedAt: new Date()
     }], {});

    }

    
  },

  async down (queryInterface, Sequelize) {  
    await queryInterface.bulkDelete('Users', null, {});
    
  }
};
