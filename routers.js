/** Questo file comprende tutte le rotte delle pagine (le viste html) dell'applicazione. */

const express = require('express');
const router = express.Router();
const routersController = require('./controller/routersController');
/** Il Middleware 'verifyToken' è utilizzato sulle pagine private. */
const verifyToken = require('./middlewares/verifyToken');
/** Il Middleware 'trackBookViews' è utilizzato sulla pagina dettaglio libro per tenere traccia delle visualizzazioni. */
const trackBookViews = require('./middlewares/trackBookViews');

/** pagina 'Home' */
router.get('/', routersController.getHome);
/** pagina riservata 'Inserisci Nuovo Libro' con middleware 'verifyToken' */
router.get('/insert-book', verifyToken, routersController.getInsertBook);
/** pagina riservata 'Modifica Libro' con middleware 'verifyToken' */
router.get('/book/edit/:id', verifyToken, routersController.getEditBook);
/** pagina 'Visualizza Libri sulla mappa' */
router.get('/view-map', routersController.getViewMap);
/** pagina 'Login' */
router.get('/login', routersController.getLogin);
/** pagina 'Registrazione/Crea Nuovo Utente' */
router.get('/sign-up', routersController.getSignUp);
/** pagina riservata 'Area Personale' con middleware 'verifyToken' */
router.get('/dashboard', verifyToken, routersController.getDashboard);
/** pagina 'Dettaglio Libro' con middleware 'trackBookViews' per tenere traccia delle visualizzazioni */
router.get('/book/:id/:slug', trackBookViews, routersController.getBook);
/** pagina '404 Not Found' */
router.get('/404', routersController.getPageNotFound);
/** pagina 'Cookie Policy' */
router.get('/cookie-policy', routersController.getCookiePolicy);
/** pagina 'Termini e Condizioni' */
router.get('/terms-and-conditions', routersController.getTermsAndConditions);
/** pagina 'Privacy Policy' */
router.get('/privacy-policy', routersController.getPrivacyPolicy);
/** pagina 'Recupera Password' */
router.get('/recover-password', routersController.getRecoverPassword);

module.exports = router;