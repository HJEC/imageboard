const express = require("express"),
    app = express();

app.use(express.static("./public"));

app.use(express.json());

app.get("/candy", (req, res) => {
    res.json([{ name: "oreo" }, { name: "skittles" }, { name: "wispa" }]);
});

app.listen(8080, () => console.log("see you space cowboy..."));
