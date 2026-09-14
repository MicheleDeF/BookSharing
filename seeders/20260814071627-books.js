 'use strict';

const { Faker, de_AT, de, en, base } = require('@faker-js/faker');
const faker = new Faker({ locale: [de_AT, de, en, base] });

function generateAlias(text) {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()                  
        .trim()                         
        .normalize('NFD')               
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[^a-z0-9 -]/g, '')    
        .replace(/\s+/g, '-')           
        .replace(/-+/g, '-');           
}

/** Camposano, Napoli, Campania, 80035, Italia 
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
const userLat = 40.949312991789604;
const userLng = 14.523031351428408;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     for (let i = 0; i < 1; i++) {

      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const province = faker.location.state({ abbreviated: true });
      const zipcode = faker.location.zipCode();
      const bookTitle = faker.book.title();


        await queryInterface.bulkInsert('Books', [{
         title: bookTitle,
         author: faker.book.author(),
         publish_year: faker.date.past({ years: 100 }).getFullYear(),
         category: 'Fantascienza',
         address: `${street}, ${zipcode} ${city} (${province})`,
         radius: '500',
         description: faker.commerce.productDescription(),
         cover: faker.image.url({width: 600,height: 800,category: 'abstract'}),
         lat: userLat + 0.0001,
         lon: userLng + 0.0001,
         userId: 4,
         slug: generateAlias(bookTitle),
         createdAt: new Date(),
         updatedAt: new Date()   
       }], {});

     }

    
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('Books', null, {});
     
  }
};