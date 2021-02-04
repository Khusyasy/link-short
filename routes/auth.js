var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth');

router.get('/login', auth.login);
router.post('/login', auth.post_login);

router.get('/register', auth.register);
router.post('/register', auth.post_register);

module.exports = router;
