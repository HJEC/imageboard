const nodemailer = require("nodemailer");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
  user: secrets.emd,
  pass: secrets.emp
}
});

exports.mailer = (req, res, next) => {

    const i = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const x = req.ip;

let mailOptions = {
    from: secrets.emd,
    to: secrets.emd,
    subject: 'dev report',
    text: 'data' + i + ' || ' + x
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      next();
    }
  });

}