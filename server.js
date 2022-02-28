const express = require("express");
const app = express();
const basicAuth = require("basic-auth");
const logger = require("morgan");
const flash = require("connect-flash");
const db = require("./sql/db");
const { hash, compare, redirectWithFlash } = require("./utils");

//Middleware
app.use(express.json());

// Set up basic auth
const auth = (req, res, next) => {
    const creds = basicAuth(req);
    if (!creds || creds.name != "a" || creds.pass != "b") {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Enter your credentials!"'
        );
        res.sendStatus(401);
    } else {
        next();
    }
};
app.use("/", auth);

//Serve content
app.use(express.static("./public"));

// Routes

app.get("/pics.json", (req, res) => {
    db.getPics()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => console.log(`getPics failed with: ${err}`));
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () =>
    console.log("Image board listening on: \nhttp://localhost:8080")
);
