var crypto = require('crypto');
var connection = require('../helpers/database');

exports.index = function (req, res, next) {
    res.render('index', { title: 'Express' });
}

exports.create_link = function (req, res, next) {
    var hash = crypto.createHash('sha1').update(req.body.link).digest("hex");
    connection.query(`INSERT INTO links (ID, link_long, link_short, created, click) VALUES (null, '${req.body.link}', '${hash}', NOW(), 0)`, function (err, results) {
        if (err) throw err
        res.redirect("/");
    });
}