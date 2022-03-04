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

exports.removePic = picId =>
    db.query(
        `
        DELETE FROM images
        WHERE id = $1`,
        [picId]
    );

exports.getComments = (picId, limit) => {
    if (limit) {
        return db.query(
            `
        SELECT * FROM comments 
        WHERE pic_id = $1
        ORDER BY id DESC
        LIMIT $2`,
            [picId, limit]
        );
    } else {
        return db.query(
            `
        SELECT * FROM comments 
        WHERE pic_id = $1
        ORDER BY id DESC`,
            [picId]
        );
    }
};

exports.addComment = (commenter, comment, picId) =>
    db.query(
        "INSERT INTO comments (commenter, comment, pic_id) VALUES ($1, $2, $3) RETURNING *",
        [commenter, comment, picId]
    );

exports.removeComment = commentId =>
    db.query(
        `
        DELETE FROM comments
        WHERE id = $1
        RETURNING *`,
        [commentId]
    );
