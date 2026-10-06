/** Questo file comprende tutte le rotte API utilizzate nel progetto. */

const express = require('express');
const router = express.Router();
/** 'upload' è utilizzato sulle rotte che richiedono il caricamento dell'immagine sul server. */
const upload = require('./config/multer'); 
const userController = require('./controller/userController');
const bookController = require('./controller/bookController');
const mapController = require('./controller/mapController');

router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.get('/user-books/:iduser', userController.getUserBooks);
router.get('/books/:page/:limit', bookController.getAllBooks);
router.get('/book/:id/:slug', bookController.getBook);
router.get('/map', mapController.getSearchBooks);
router.get('/user-messages/:iduser', userController.getUserMessages);
router.post('/send-message', userController.userSendMessage);
router.post('/send-message-book-detail-page', userController.userSendMesssageOnDetailBook);
router.post('/update-unread-messages', userController.userUpdateUnreadMessages);
router.post('/user-registration', userController.userRegistration);
router.post('/create-new-book', upload.single('copertina_libro'), bookController.createNewBook);
router.delete('/book/:id', bookController.deleteBook);
router.post('/book/edit/:id', upload.single('copertina_libro'), bookController.editBook);
router.post('/edit-profile-user', userController.editProfileUser);
router.post('/update-availability-book/:id', bookController.updateAvailabilityBook);
router.get('/captcha', userController.genSvgCaptchaFromRegUser);
module.exports = router;