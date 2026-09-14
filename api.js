const express = require('express');
const router = express.Router();
const userController = require('./controller/userController');
const bookController = require('./controller/bookController');
const mapController = require('./controller/mapController');

router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.get('/user-books/:iduser', userController.getUserBooks);
router.get('/books/:page/:limit', bookController.getAllBooks);
router.get('/book/:id/:slug', bookController.getBook);
router.get('/map', mapController.getSearchBooks);

module.exports = router;