var connection = require('../helpers/database');
var URLisValid = require('../helpers/url_validation');
var createShortID = require('../helpers/short_hash');

exports.index = function (req, res, next) {
    res.render('index', { title: 'Link Shortener', msg: req.session.msg });
}

exports.create_link = async function (req, res, next) {
    var url = req.body.link;
    if (URLisValid(url)) {
        var hash = createShortID(url);
        try {
            var query_res = await connection.query(`INSERT INTO links (ID, link_long, link_short, created, click) VALUES (null, '${escape(url)}', '${hash}', NOW(), 0)`);
            res.redirect("/created/" + hash);
        } catch (err) {
            req.session.msg = { status: "error", text: "Connection Error" };
            res.redirect("/");
        }
    } else {
        req.session.msg = { status: "error", text: "URL is invalid" };
        res.redirect("/");
    }
}

exports.get_link = async function (req, res, next) {
    try {
        var query_res = await connection.query(`SELECT * FROM links WHERE link_short = '${escape(req.params.hash)}'`);
        link = query_res[0][0];
        if (link) {
            connection.query(`UPDATE links SET click = ${link.click + 1} WHERE ID = ${link.ID}`);
            res.render('link', { title: "Redirecting", link: unescape(link.link_long) });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        req.session.msg = { status: "error", text: "Connection Error" };
        res.redirect("/");
    }
}

exports.created = async function (req, res, next) {
    var hash = req.params.hash;
    try {
        var query_res = await connection.query(`SELECT * FROM links WHERE link_short = '${escape(hash)}'`);
        var link = query_res[0][0];
        if (link) {
            res.render('created', { title: "Created - " + unescape(link.link_long), long: unescape(link.link_long), short: process.env.BASE_URL + hash, stats: process.env.BASE_URL + "stats/" + hash });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        req.session.msg = { status: "error", text: "Connection Error" };
        res.redirect("/");
    }
}

exports.view_link = async function (req, res, next) {
    var hash = req.params.hash;
    try {
        var query_res = await connection.query(`SELECT * FROM links WHERE link_short = '${escape(hash)}'`);
        var link = query_res[0][0];
        if (link) {
            res.render('stats', { title: "Created - " + unescape(link.link_long), long: unescape(link.link_long), short: process.env.BASE_URL + hash, click: link.click });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        req.session.msg = { status: "error", text: "Connection Error" };
        res.redirect("/");
    }
}