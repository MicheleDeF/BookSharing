const express = require('express');
const router = express.Router();
const routersController = require('./controller/routersController');
const verifyToken = require('./middlewares/verifyToken');

router.get('/', routersController.getHome);
router.get('/insert-book', verifyToken, routersController.getInsertBook);
router.get('/view-map', routersController.getViewMap);
router.get('/login', routersController.getLogin);
router.get('/sign-up', routersController.getSignUp);
router.get('/dashboard', verifyToken, routersController.getDashboard);
router.get('/book/:id/:slug', routersController.getBook);
router.get('/404', routersController.getPageNotFound);
module.exports = router;