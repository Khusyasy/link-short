var connection = require('../helpers/database');
var bcrypt = require('bcrypt');

exports.login = function (req, res, next) {
    res.render('login', { title: 'Login', msg: req.session.msg });
}

exports.post_login = async function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        try {
            var query_res = await connection.query(`SELECT * FROM users WHERE username = '${escape(username)}'`);
            var user = query_res[0][0];
            if (user) {
                var match = await bcrypt.compare(password, user.password);
                if (match) {
                    req.session.userLogin = user;
                    res.redirect(req.session.referLogin || "/");
                    req.session.referLogin = null;
                } else {
                    req.session.msg = { status: "error", text: "Username or password not found" };
                    res.redirect("login");
                }
            } else {
                req.session.msg = { status: "error", text: "Username or password not found" };
                res.redirect("login");
            }
        } catch (err) {
            console.log(err);
            req.session.msg = { status: "error", text: "Connection Error" };
            res.redirect("login");
        }
    } else {
        req.session.msg = { status: "error", text: "Enter username and password" };
        res.redirect("login");
    }
}

exports.register = function (req, res, next) {
    res.render('register', { title: 'Register', msg: req.session.msg });
}

exports.post_register = function (req, res, next) {
    //todo
}

exports.check_login = async function (req, res, next) {
    var user = req.session.userLogin;
    if (user) {
        next();
    } else {
        req.session.referLogin = req.url;
        res.redirect("/auth/login");
    }
}