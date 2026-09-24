/** Questo file comprende tutte le rotte delle pagine dell'applicazione. */

const express = require('express');
const router = express.Router();
const routersController = require('./controller/routersController');
const verifyToken = require('./middlewares/verifyToken');
const trackBookViews = require('./middlewares/trackBookViews');

router.get('/', routersController.getHome);
router.get('/insert-book', verifyToken, routersController.getInsertBook);
router.get('/book/edit/:id', verifyToken, routersController.getEditBook);
router.get('/view-map', routersController.getViewMap);
router.get('/login', routersController.getLogin);
router.get('/sign-up', routersController.getSignUp);
router.get('/dashboard', verifyToken, routersController.getDashboard);
router.get('/book/:id/:slug', trackBookViews, routersController.getBook);
router.get('/404', routersController.getPageNotFound);
router.get('/cookie-policy', routersController.getCookiePolicy);
router.get('/terms-and-conditions', routersController.getTermsAndConditions);
router.get('/privacy-policy', routersController.getPrivacyPolicy);
router.get('/recover-password', routersController.getRecoverPassword);
module.exports = router;