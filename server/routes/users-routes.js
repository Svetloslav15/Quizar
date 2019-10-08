const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const auth = require('../config/auth');

router.get('/register', controllers.users.registerGet);
router.post('/register', controllers.users.registerPost);
router.get('/login', controllers.users.loginGet);
router.post('/login', controllers.users.loginPost);
router.get('/logout', controllers.users.logout);
router.post('/profile/edit/:id', controllers.users.editProfile);

module.exports = router;