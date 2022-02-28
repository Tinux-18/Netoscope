const { redirect, render } = require("express/lib/response");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");

exports.redirectWithFlash = (
    res,
    req,
    redirectPage,
    flashName,
    flashMessage
) => {
    if (!flashName) {
        req.flash(
            "generalError",
            "Oops, something went wrong! Try again!"
        );
        res.redirect(redirectPage);
    } else {
        req.flash(flashName, flashMessage);
        res.redirect(redirectPage);
    }
};

exports.hash = password => {
    return bcrypt.genSalt().then(salt => {
        return bcrypt.hash(password, salt);
    });
};

exports.compare = bcrypt.compare;
