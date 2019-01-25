const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home-controller');
const auth = require('../config/auth');

router.get('/', homeController.index);
router.get('/rules', homeController.rules);
router.get('/chatroom', auth.isAuthenticated, homeController.chatRoom);
router.get('/myprofile/:id', auth.isAuthenticated, homeController.myprofile);

module.exports = router;