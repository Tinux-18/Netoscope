const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${
            require("/home/tinux/projects/rue-imageboard/secrets.json")
                .psqlUser
        }:${
            require("/home/tinux/projects/rue-imageboard/secrets.json")
                .psqlPassword
        }@localhost:5432/imageboard`
);

exports.getPics = picId => {
    if (picId) {
        return db.query("SELECT * FROM images WHERE id = ($1)", [
            picId,
        ]);
    } else {
        return db.query("SELECT * FROM images ORDER BY id DESC");
    }
};

exports.addPic = (url, username, title, description) =>
    db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [url, username, title, description]
    );
