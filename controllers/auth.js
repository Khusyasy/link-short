var connection = require('../helpers/database');
var bcrypt = require('bcrypt');
var createShortID = require('../helpers/short_hash');
var mail = require("../helpers/mail");

exports.login = function (req, res, next) {
    res.render('login', { title: 'Login', msg: req.flash("message")[0] });
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
                    req.flash("message", { status: "error", text: "Username or password not found" });
                    res.redirect("login");
                }
            } else {
                req.flash("message", { status: "error", text: "Username or password not found" });
                res.redirect("login");
            }
        } catch (err) {
            req.flash("message", { status: "error", text: "Connection Error" });
            res.redirect("login");
        }
    } else {
        req.flash("message", { status: "error", text: "Enter username and password" });
        res.redirect("login");
    }
}

exports.register = function (req, res, next) {
    res.render('register', { title: 'Register', msg: req.flash("message")[0] });
}

exports.post_register = async function (req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    if (!username || !email || !password || !cpassword) {
        res.redirect("register");
    } else if (password != cpassword) {
        req.flash("message", { status: "error", text: "Password doesn't match" });
        res.redirect("register");
    }
    try {
        var pass_hash = await bcrypt.hash(password, 12);
        var verify_hash = createShortID(username + email);
        var query_res = await connection.query(`INSERT INTO users (ID, username, email, password, verified, verify_hash, remember_hash) VALUES (null, '${escape(username)}', '${escape(email)}', '${pass_hash}', false, '${verify_hash}', null)`);
        var sendEmail = mail.send_verification(escape(email), verify_hash);
        req.flash("message", { status: "success", text: "Check your email for a verification link" });
        res.redirect("login");
    } catch (err) {
        var msg = "Connection Error";
        console.log(err);
        if (err.errno == 1062) {
            [val, field] = err.sqlMessage.match(/\'([^\']+)\'/g);
            if (field == "'username'") {
                msg = `The username ${val} is already taken`;
            } else if (field == "'email'") {
                msg = `The email address ${val} already have an account associated`;
            }
        }
        req.flash("message", { status: "error", text: msg });
        res.redirect("register");
    }
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

exports.verify = async function (req, res, next) {
    var hash = req.params.hash;
    var email = req.params.email;
    console.log(hash, email);
    try {
        var query_res = await connection.query(`SELECT * FROM users WHERE email = '${escape(email)}' AND verify_hash = '${escape(hash)}'`);
        if (query_res[0].length != 1) throw "Email and ihash not found";
        var query_res = await connection.query(`UPDATE users SET verify_hash = null, verified = true WHERE email = '${escape(email)}'`);
        req.flash("message", { status: "success", text: "Verification done, please login to your account" });
        res.redirect("/auth/register");
    } catch (err) {
        console.log(err);
        req.flash("message", { status: "error", text: "Invalid verification link" });
        res.redirect("/");
    }
}