var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth');

router.get('/login', auth.login);

module.exports = router;
