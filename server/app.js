const express = require("express");
const app = express();
const cors = require("cors");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "DragMe Upload Image BE" });
});

cloudinary.config({
  cloud_name: "dragme",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(fileUpload());

app.post("/upload", (req, res) => {
  const newPhoto = req.files["photo"].data.toString("base64");
  console.log('heroku newphoto', newPhoto)
  const type = req.files["photo"].mimetype;
  console.log('heroku type', type)

  cloudinary.v2.uploader.upload(
    `data:${type};base64,${newPhoto}`,
    (err, photo) => {
      if (err) {
        console.error(err);
        res.status(400).send(err);
      } else {
        const photoUrl = photo.url;
        res.status(201).json({ photoUrl });
      }
    }
  );
});

module.exports = app;
