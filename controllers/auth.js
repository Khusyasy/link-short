var connection = require('../helpers/database');

exports.login = function (req, res, next) {
    res.render('login', { title: 'Login', msg: req.session.msg });
}

exports.post_login = function (req, res, next) {
    //todo
}

exports.register = function (req, res, next) {
    res.render('register', { title: 'Register', msg: req.session.msg });
}

exports.post_register = function (req, res, next) {
    //todo
}