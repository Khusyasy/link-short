var express = require('express');
var router = express.Router();

var index = require('../controllers/index');
var auth = require('../controllers/auth');

/* GET home page. */
router.get('/', index.index);
router.post('/', index.create_link);
router.get('/created/:hash', index.created);
router.get('/:hash', index.get_link);
router.get('/stats/:hash', auth.check_login, index.view_link);

module.exports = router;
