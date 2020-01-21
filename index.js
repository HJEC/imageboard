const express = require("express"),
    app = express(),
    { getImages, importImages } = require("./dbFuncs"),
    { upload } = require("./s3"),
    config = require("./config");

app.use(express.static("./public"));

// IMAGE UPLOAD BOILER PLATE
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
// __IMAGE PROFILE UPLOAD__
app.use(express.json());

app.get("/images", (req, res) => {
    getImages().then(rows => {
        res.json(rows);
    });
    console.log("images: ", getImages());
});

app.post("/upload", uploader.single("file"), upload, (req, res) => {
    console.log("file: ", req.file);
    console.log("input:", req.body);
    let url = config.s3Url + req.file.filename;
    let title = req.body.title;
    let username = req.body.username;
    let description = req.body.description;

    console.log("file contents:", url, title, username, description);

    importImages(url, title, username, description)
        .then(response => {
            console.log("response from import:", response.rows[0]);
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log("error in import: ", err);
            res.sendStatus(500);
        });
});
app.listen(8080, () => console.log("see you space cowboy..."));
