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
