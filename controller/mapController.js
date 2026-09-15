const { Book, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

const getSearchBooks = async (req, res)=>{    
    const { category, lat, lon } = req.query;
    const radius = 500; // 500 metri

    try {

     const queryDistance = Sequelize.literal(
            `6371000 * ACOS( 
              COS(RADIANS(${lat})) * COS(RADIANS(Book.lat)) * 
               COS(RADIANS(Book.lon) - RADIANS(${lon})) + 
                SIN(RADIANS(${lat})) * SIN(RADIANS(Book.lat)))`
        );

     if(category){

        const books = await Book.findAll({
            attributes: ['id', 'title', 'category', 'lat', 'lon', 'cover', 'description', 'slug', [queryDistance, 'distance']],
            where: {category: category, [Op.and]: Sequelize.where(queryDistance, { [Op.lte]: radius })},
            include: [{ model: User, as: 'user', attributes: ['id', 'lastName', 'firstName', 'avatar', 'description'] }],
            order: [[Sequelize.literal('distance'), 'ASC']]
        });

        return res.status(200).json({
            success: true,
            message: 'Libri recuperati con successo.',
            books: books
        });


      }else{
         const books = await Book.findAll({
            attributes: ['id', 'title', 'category', 'lat', 'lon', 'cover', 'description', 'slug', [queryDistance, 'distance']],
            where: { [Op.and]: Sequelize.where(queryDistance, { [Op.lte]: radius })},
            include: [{ model: User, as: 'user', attributes: ['id', 'lastName', 'firstName', 'avatar', 'description'] }],
            order: [[Sequelize.literal('distance'), 'ASC']]
        });

         return res.status(200).json({
            success: true,
            message: 'Libri recuperati con successo.',
            books: books
        });
  
      }
        
    } catch (error) {
            return res.status(500).json({
            success: false,
            message: "Errore interno del server durante il recupero dei libri.",
            error: error.message
          });
    }
};

module.exports = {
  getSearchBooks,
  
};