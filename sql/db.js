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