const spicedPg = require("spiced-pg"),
    db = spicedPg(
        process.env.DATABASE_URL ||
            "postgres:postgres:postgres@localhost:5432/imageboard"
    );

exports.getImages = function() {
    return db
        .query(
            `SELECT url, username, title, description, id FROM images ORDER BY id DESC LIMIT 8`
        )
        .then(({ rows }) => rows);
};

exports.getMoreImages = function(lastId) {
    return db
        .query(
            `SELECT id, url, title, description, (
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
                ) AS "lowestId" FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 8`,
            [lastId]
        )
        .then(({ rows }) => rows);
};

exports.importImages = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    );
};

exports.getClickedImage = function(id) {
    return db
        .query(
            `SELECT url, username, title, description, id FROM images WHERE id = $1`,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.addComment = function(image_id, username, comment) {
    return db.query(
        `INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *`,
        [image_id, username, comment]
    );
};

exports.getComments = function(id) {
    return db
        .query(`SELECT * FROM comments WHERE image_id = $1`, [id])
        .then(({ rows }) => rows);
};
