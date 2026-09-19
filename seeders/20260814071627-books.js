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

// Genera una descrizione con una lunghezza minima di caratteri personalizzata.
function getLongProductDescription(minLength = 500) {
  let desc = faker.commerce.productDescription();
  while (desc.length < minLength) {
    desc += ' ' + faker.commerce.productDescription();
  }
  return desc;
}

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
/** Camposano, Napoli, Campania, 80035, Italia */
const userLat = 40.949282740897054;
const userLng = 14.523030645794485;

const typeCategories = ["Romanzo", "Gialli/Thriller", "Fantascienza", "Fumetti", "Altro"];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     for (let i = 0; i < 2; i++) {

      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const province = faker.location.state({ abbreviated: true });
      const zipcode = faker.location.zipCode();
      const bookTitle = faker.book.title();


        await queryInterface.bulkInsert('Books', [{
         title: bookTitle,
         author: faker.book.author(),
         publish_year: faker.date.past({ years: 100 }).getFullYear(),
         category: faker.helpers.arrayElement(typeCategories),
         address: `${street}, ${zipcode} ${city} (${province})`,
         radius: '500',
         description: getLongProductDescription(500),
         cover: faker.image.url({width: 600,height: 800,category: 'abstract'}),
         lon: userLng + 0.0015,
         lat: userLat - 0.0015,
         userId: 6,
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