const { redirect, render } = require("express/lib/response");
const flash = require("connect-flash");

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
