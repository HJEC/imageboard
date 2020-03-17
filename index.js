const express = require("express"),
    app = express(),
    {
        getImages,
        getMoreImages,
        importImages,
        deleteImage,
        getClickedImage,
        addComment,
        getComments,
        findLastImage
    } = require("./dbFuncs"),
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
// __IMAGE UPLOAD__

app.use(express.json());

// GET IMAGE ROUTES
app.get("/images", (req, res) => {
    getImages().then(rows => {
        res.json(rows);
    });
});

app.get("/images/:lastId", (req, res) => {
    getMoreImages(req.params.lastId).then(response => {
        res.json(response);
    });
});

// UPLOAD IMAGES ROUTE
app.post("/upload", uploader.single("file"), upload, (req, res) => {
    let url = config.s3Url + req.file.filename;
    let title = req.body.title;
    let username = req.body.username;
    let description = req.body.description;

    console.log("file contents:", url, title, username, description);

    importImages(url, title, description, username)
        .then(response => {
            console.log("response from import:", response.rows[0]);
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log("error in import: ", err);
            res.sendStatus(500);
        });
});

// TODO: DELETE IMAGES
app.post("/delete", async (req, res) => {
    let id = req.body.id;
    await deleteImage(id);
    res.json({ success: true });
});

// SELECTED IMAGE ROUTE
app.get("/selected/:id", (req, res) => {
    let id = req.params.id;
    getClickedImage(id)
        .then(rows => {
            res.json(rows[0]);
        })
        .catch(err => console.log("Server error in Modal request: ", err));
});

// LAST IMAGE ROUTE
app.get("/last", (req, res) => {
    findLastImage().then(response => {
        res.json(response);
    });
});

// COMMENT ROUTES
app.get("/comments/:imageId", (req, res) => {
    let id = req.params.imageId;
    getComments(id).then(response => {
        res.json(response);
    });
});

app.post("/addcomment/:imageId/:username/:comment", (req, res) => {
    // console.log("add comment POST requested");
    let imageId = req.params.imageId,
        username = req.params.username,
        comment = req.params.comment;

    addComment(imageId, username, comment)
        .then(response => {
            // console.log("response from comment POST: ", response.rows[0]);
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log("Error in comment post: ", err);
        });
});

app.listen(8080, () => console.log("see you space cowboy..."));
