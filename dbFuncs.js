const spicedPg = require("spiced-pg"),
    db = spicedPg(
        process.env.DATABASE_URL ||
            "postgres:postgres:postgres@localhost:5432/imageboard"
    );

exports.getImages = function() {
    return db
        .query(`SELECT url, username, title, description FROM images`)
        .then(({ rows }) => rows);
};

exports.importImages = function(url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id`,
        [url, username, title, description]
    );
};
