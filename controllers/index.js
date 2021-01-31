var connection = require('../helpers/database');
var URLisValid = require('../helpers/url_validation');
var createShortID = require('../helpers/short_hash');

exports.index = function (req, res, next) {
    res.render('index', { title: 'Express', msg: req.session.msg });
}

exports.create_link = function (req, res, next) {
    var url = req.body.link;
    if (URLisValid(url)) {
        var hash = createShortID(url);
        connection.query(`INSERT INTO links (ID, link_long, link_short, created, click) VALUES (null, '${escape(url)}', '${hash}', NOW(), 0)`, function (err, results) {
            if (err) {
                req.session.msg = { status: "error", text: "Connection Error" };
                res.redirect("/");
            } else {
                res.redirect("/created/" + hash);
            }
        });
    } else {
        req.session.msg = { status: "error", text: "URL is invalid" };
        res.redirect("/");
    }
}

exports.get_link = function (req, res, next) {
    connection.query(`SELECT * FROM links WHERE link_short = '${escape(req.params.hash)}'`, function (err, results, fields) {
        if (err) {
            req.session.msg = { status: "error", text: "Connection Error" };
            res.redirect("/");
        } else if (results[0]) {
            res.render('link', { title: "Redirecting", link: unescape(results[0].link_long) });
            connection.query(`UPDATE links SET click = ${results[0].click + 1} WHERE ID = ${results[0].ID}`, function (e, r) { if (e) console.log(e); });
        } else {
            res.sendStatus(404);
        }
    });
}

exports.created = function (req, res, next) {
    var hash = req.params.hash;
    connection.query(`SELECT * FROM links WHERE link_short = '${escape(hash)}'`, function (err, results, fields) {
        if (err) {
            req.session.msg = { status: "error", text: "Connection Error" };
            res.redirect("/");
        } else if (results[0]) {
            res.render('created', { title: "Created", long: unescape(results[0].link_long), short: process.env.BASE_URL + hash });
        } else {
            res.sendStatus(404);
        }
    });
}