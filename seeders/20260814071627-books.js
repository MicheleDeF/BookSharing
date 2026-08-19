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


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


     for (let i = 0; i < 10; i++) {

      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const province = faker.location.state({ abbreviated: true });
      const zipcode = faker.location.zipCode();
      const bookTitle = faker.book.title();

        await queryInterface.bulkInsert('Books', [{
         title: bookTitle,
         author: faker.book.author(),
         publish_year: faker.date.past({ years: 100 }).getFullYear(),
         category: 'Romanzo',
         address: `${street}, ${zipcode} ${city} (${province})`,
         radius: '500',
         description: faker.commerce.productDescription(),
         cover: faker.image.url({width: 600,height: 800,category: 'abstract'}),
         lat: faker.location.latitude({ max: 41, min: 40 }),
         lon: faker.location.longitude({max: 15, min: 14 }),
         userId: 2,
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