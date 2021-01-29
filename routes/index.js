var express = require('express');
var router = express.Router();

var index = require('../controllers/index');

/* GET home page. */
router.get('/', index.index);
router.post('/', index.create_link);
router.get('/:hash', index.get_link);

module.exports = router;
