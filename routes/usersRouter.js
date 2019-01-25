const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users-controller');

router.post('/register', usersController.registerPost);
router.post('/login', usersController.loginPost);
router.get('/logout', usersController.logout);

module.exports = router;