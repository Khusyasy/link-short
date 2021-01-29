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

exports.get_link = function (req, res, next) {
    connection.query(`SELECT * FROM links WHERE link_short = '${req.params.hash}'`, function (err, results, fields) {
        if (err) throw err
        if (results[0]) {
            res.render('link', { title: "Redirecting", link: results[0].link_long });
            connection.query(`UPDATE links SET click = ${results[0].click + 1} WHERE ID = ${results[0].ID}`, function (e, r) {
                if (e) throw e
            });
        } else {
            res.sendStatus(404);
        }
    });
}