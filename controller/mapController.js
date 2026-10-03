const { Book, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

/** Questo controlle gestisce i dati da visualizare sulla mappa */

const getSearchBooks = async (req, res)=>{    
    /** Se l'utente è loggato i sui contenuti non sono visibili sulla mappa. */
    const currentUserId = res.locals.userLogged ? res.locals.userLogged.id : null;
    /** Dati passati come query nell'url. */
    const { category, lat, lon } = req.query;
    const radius = 500; // 500 metri  
    
    /** Dati per convalidare tipo di categoria, latitudine e longitudine */
    const typeCategories = ["Romanzo", "Gialli/Thriller", "Fantascienza", "Fumetti", "Altro"];
    const latRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const lonRegex = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    

    try {

    /** const queryDistance : 
     *  Questa query serve a calcolare la distanza geografica in metri tra due punti 
     *  6371000: È il raggio medio della Terra espresso in metri (6.371 km). 
     *  Moltiplicando il risultato finale per questo numero, si ottiene la distanza in metri.
     * 
     *  RADIANS(...), questa funzione converte i gradi in radianti.
     * 
     *  ACOS( COS(...) * COS(...) * COS(...) + SIN(...) * SIN(...) ), 
     *  è la struttura geometrica che calcola l'angolo al centro della Terra tra i due punti.
     * 
     */

     const queryDistance = Sequelize.literal(
            `6371000 * ACOS( 
              COS(RADIANS(${lat})) * COS(RADIANS(Book.lat)) * 
               COS(RADIANS(Book.lon) - RADIANS(${lon})) + 
                SIN(RADIANS(${lat})) * SIN(RADIANS(Book.lat)))`
        );

     if(category){
      
      /** Canvalida Categoria, Latitudine e Longitudine */
      if( !typeCategories.includes(category) || !latRegex.test(lat) || !lonRegex.test(lon)){
         return res.status(404).json({
            success: false,
            message: "Pagina non trovata."
          }); 
       }

        const books = await Book.findAll({
            attributes: ['id', 'title', 'category', 'lat', 'lon', 'cover', 'description', 'slug', [queryDistance, 'distance']],
            where: {
                    category: category, 
                    [Op.and]: Sequelize.where(queryDistance, { [Op.lte]: radius }),
                    /** questa condizione esclude i contenuti dell'utente se ha effettuato il login */
                    ...(currentUserId && { userId: { [Op.ne]: currentUserId } }),
                  },                    
            include: [{ model: User, as: 'user', attributes: ['id', 'lastName', 'firstName', 'avatar', 'description'] }],
            order: [[Sequelize.literal('distance'), 'ASC']]
        });

        return res.status(200).json({
            success: true,
            message: 'Libri recuperati con successo.',
            books: books
        });


      }else{
        /** Canvalid Latitudine e Longitudine */
        if( !latRegex.test(lat) || !lonRegex.test(lon)){
          return res.status(404).json({
              success: false,
              message: "Pagina non trovata."
            }); 
        }

         const books = await Book.findAll({
            attributes: ['id', 'title', 'category', 'lat', 'lon', 'cover', 'description', 'slug', [queryDistance, 'distance']],
            where: { 
                  [Op.and]: Sequelize.where(queryDistance, { [Op.lte]: radius }),
                  /** questa condizione esclude i contenuti dell'utente se ha effettuato il login */
                  ...(currentUserId && { userId: { [Op.ne]: currentUserId } }),                  
                },
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