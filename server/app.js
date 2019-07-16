const express = require("express");
const app = express();
const cors = require('cors')


app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.status(200).json({message: 'DragMe Upload Image BE'});
});

const cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: 'dragme',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUpload = require('express-fileupload');

app.use(fileUpload());

app.post('/upload', (req, res) => {
  const newPhoto = req.files['photo'].data.toString('base64');
  const type = req.files['photo'].mimetype;

  cloudinary.v2.uploader.upload(`data:${type};base64,${newPhoto}`, (err, photo) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      const photoUrl = photo.url;
      res.status(201).json({photoUrl});
    }
  })
})

module.exports = app