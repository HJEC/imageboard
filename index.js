const express = require("express"),
    app = express(),
    { getImages, importImages } = require("./dbFuncs");

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

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file: ", req.file);
    console.log("input:", req.body);
    let url = req.file.path;
    let title = req.body.title;
    let username = req.body.username;
    let description = req.body.description;
    console.log("file contents:", url, title, username, description);
    if (req.file) {
        importImages(url, title, username, description).then(
            res.json({
                success: true
            })
        );
    } else {
        res.json({
            success: false
        });
    }
});
app.listen(8080, () => console.log("see you space cowboy..."));
