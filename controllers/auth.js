var connection = require('../helpers/database');

exports.login = function (req, res, next) {
    res.render('login', { title: 'Login', msg: req.session.msg });
}

exports.logout = function (req, res, next) {
    res.render('index', { title: 'Link Shortener', msg: req.session.msg });
}