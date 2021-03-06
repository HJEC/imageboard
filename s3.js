const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        res.sendStatus(500);
        console.log("req.file does not exist:");
        return;
    }
    const { filename, mimetype, size, path } = req.file;
    s3.putObject({
        Bucket: "hjec-imageboard",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(() => {
            console.log("upload worked: ");
            next();
            fs.unlink(path, () => {});
        })
        .catch(err => {
            console.log("error in upload to aws: ", err);
            res.sendStatus(500);
        });
};
