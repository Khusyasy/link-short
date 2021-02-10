var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "khusyasy@gmail.com",
        pass: "dyllugfdemkegdug",
    },
});

exports.send_verification = async function (email, hash) {
    try {
        var info = await transporter.sendMail({
            from: '"Link Shortener" <khusyasy@gmail.com>',
            to: email,
            subject: "Account Verification",
            html: `<h3>This is your verification link:</h3><a href="${process.env.BASE_URL}auth/verify/${hash}/${email}">${process.env.BASE_URL}auth/verify/${hash}/${email}</a>`,
        });
        console.log("Message sent: ", info.messageId);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}