const express = require("express"),
    app = express(),
    { getImages } = require("./dbFuncs");

app.use(express.static("./public"));

app.use(express.json());

app.get("/images", (req, res) => {
    getImages().then(rows => {
        res.json(rows);
    });
    console.log("images: ", getImages());
});

app.listen(8080, () => console.log("see you space cowboy..."));
