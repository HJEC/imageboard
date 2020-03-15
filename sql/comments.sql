DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INT REFERENCES images(id) ON DELETE cascade,
    username VARCHAR(255) NOT NULL,
    comment VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
