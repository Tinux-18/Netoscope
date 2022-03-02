const { redirect, render } = require("express/lib/response");

exports.checkInput = (res, req, next) => {
    console.log("req :>> ", req);
    next();
};
