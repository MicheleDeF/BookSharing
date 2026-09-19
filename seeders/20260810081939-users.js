'use strict';

const { Faker, it, de_AT, de, en, base } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const faker = new Faker({ locale: [it, de_AT, de, en, base] });

/** Camposano, Napoli, Campania, 80035, Italia 
 * const userLat = 40.949312991789604;
 * const userLng = 14.523031351428408;
 * 
 * Via Salice, Casalnuovo di Napoli, Napoli, Campania, 80013, Italia
 * const userLat = 40.90154601444162;
 * const userLng = 14.33668455234904;
 * 
 * latitudine: userLat + 0.0001, // Spostamento di circa 11 metri
 * longitudine: userLng + 0.0001
 * 
 * latitudine: userLat - 0.0015, // Spostamento di circa 170 metri
 * longitudine: userLng + 0.0015
 * 
 * latitudine: userLat + 0.00045, // Spostamento di circa 50 metri
 * longitudine: userLng + 0.00045
 * 
 * latitudine: userLat + 0.0035, // Spostamento di circa 390 metri
 * longitudine: userLng - 0.0020
*/
/** Via Nazionale delle Puglie, Casalnuovo di Napoli, Napoli, Campania, 80013, Italia */
// const userLat = 40.90175612223269;
// const userLng = 14.336299772648765;

/** Camposano, Napoli, Campania, 80035, Italia */
const userLat = 40.949282740897054;
const userLng = 14.523030645794485;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 1; i++) {

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
        radius: '500',
        lon: userLng + 0.0015,
        lat: userLat - 0.0015,
        createdAt: new Date(),
        updatedAt: new Date()
     }], {});

    }

    
  },

  async down (queryInterface, Sequelize) {  
    await queryInterface.bulkDelete('Users', null, {});
    
  }
};
