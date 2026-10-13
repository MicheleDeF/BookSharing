/** Questo file comprende tutte le rotte API utilizzate nel progetto. */

const express = require('express');
const router = express.Router();
/** 'upload' è utilizzato sulle rotte che richiedono il caricamento dell'immagine sul server. */
const upload = require('./config/multer'); 
/** importazione dei controller 'userController', 'bookController', 'mapController'  */
const userController = require('./controller/userController');
const bookController = require('./controller/bookController');
const mapController = require('./controller/mapController');

/** api 'login' */
router.post('/login', userController.userLogin);
/** api 'logout' */
router.post('/logout', userController.userLogout);
/** api 'Lista libri di uno specifico utente' */
router.get('/user-books/:iduser', userController.getUserBooks);
/** api 'Lista di tutti i libri con paginazione' */
router.get('/books/:page/:limit', bookController.getAllBooks);
/** api 'Dettaglio singolo libro' */
router.get('/book/:id/:slug', bookController.getBook);
/** api 'Visualizza dati sulla mappa' */
router.get('/map', mapController.getSearchBooks);
/** api 'Lista messaggi inviati e ricevuti di uno specifico utente' */
router.get('/user-messages/:iduser', userController.getUserMessages);
/** api 'Invia un messaggio da 'Area Personale' */
router.post('/send-message', userController.userSendMessage);
/** api 'Invia un messaggio da 'Pagina dettaglio libro' */
router.post('/send-message-book-detail-page', userController.userSendMesssageOnDetailBook);
/** api 'Segnala messaggi come letti' */
router.post('/update-unread-messages', userController.userUpdateUnreadMessages);
/** api 'Registrazione utente' */
router.post('/user-registration', userController.userRegistration);
/** api 'Inserisci un nuovo libro' con middleware 'upload' per caricamento immagine sul server */
router.post('/create-new-book', upload.single('copertina_libro'), bookController.createNewBook);
/** api 'Cancella specifico libro' */
router.delete('/book/:id', bookController.deleteBook);
/** api 'Modifica specifico libro' con middleware 'upload' per caricamento immagine sul server */
router.post('/book/edit/:id', upload.single('copertina_libro'), bookController.editBook);
/** api 'Modifica profilo utente' */
router.post('/edit-profile-user', userController.editProfileUser);
/** api 'Imposta libro come disponibile o non disponibile' */
router.post('/update-availability-book/:id', bookController.updateAvailabilityBook);
/** api 'Genera captcha nella pagina di registrazione utente' */
router.get('/captcha', userController.genSvgCaptchaFromRegUser);

module.exports = router;