const express = require("express");
const app = express();
const basicAuth = require("basic-auth");
const logger = require("morgan");
const flash = require("connect-flash");
const db = require("./sql/db");
const { serverUpload } = require("./utils/multer_upload");
const { s3Upload } = require("./utils/aws");
const {
    imageboardUser: user,
    imageboardPass: pass,
} = require("./secrets.json");

// Set up basic auth
const auth = (req, res, next) => {
    const creds = basicAuth(req);
    if (!creds || creds.name != user || creds.pass != pass) {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Enter your credentials!"'
        );
        res.sendStatus(401);
    } else {
        next();
    }
};

//Middleware
app.use(express.json());
app.use(logger("dev"));
app.use(flash());
app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    next();
}); // middleware to prevent your site from being used in clickjacking
app.use("*", auth);

//Serve content
app.use(express.static("./public"));

// Routes

app.get("/pics.json/:params", (req, res) => {
    let [picId, offsetId] = req.params.params
        .replace(":", "")
        .split(":");

    if (picId == 0) {
        picId = undefined;
    }

    if (offsetId == 0) {
        offsetId = undefined;
    }

    // console.log("picId :>> ", picId);
    // console.log("offsetId :>> ", offsetId);

    db.getPics(picId, offsetId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(`getPics failed with: ${err}`);
            return res.sendStatus(403);
        });
});

app.get("/comments.json/:params", (req, res) => {
    let [picId, limit] = req.params.params
        .replace(":", "")
        .split(":");
    if (limit == 0) {
        limit = undefined;
    }

    db.getComments(picId, limit)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => console.log(`getComments failed with: ${err}`));
});

app.delete("/comments", (req, res) => {
    db.removeComment(req.body.id)
        .then(({ rows }) => {
            console.log(
                `comment ${req.body.id} removed successfully`
            );
            res.json(rows[0]);
            res.status(200);
        })
        .catch(err => {
            console.log(`getComments failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.post("/comments", (req, res) => {
    db.addComment(
        req.body.commenter,
        req.body.comment,
        req.body.picId
    )
        .then(({ rows }) => {
            console.log("rows :>> ", rows);
            console.log(
                `comment for img with id ${req.body.picId} added successfully`
            );
            res.json(rows[0]);
            res.status(200);
        })
        .catch(err => {
            console.log(`addComment failed with: ${err}`);
            return res.sendStatus(500);
        });
});

app.post(
    "/upload",
    serverUpload.single("file"),
    s3Upload,
    (req, res) => {
        console.log("/upload hit");
        if (!req.body.username) {
            return res.sendStatus(500);
        }
        db.addPic(
            `https://s3.amazonaws.com/spicedling/${req.file.filename}`,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then(({ rows }) => {
                console.log(`img: ${req.body.title} has been added`);
                res.json(rows[0]);
            })
            .catch(err => {
                console.log(`addPic failed with: ${err}`);
                return res.sendStatus(500);
            });
    }
);

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () =>
    console.log("Image board listening on: \nhttp://localhost:8080")
);
