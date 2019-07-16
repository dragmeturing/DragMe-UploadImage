const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors')
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const key = require('../key')

app.use(bodyParser.json());
app.use(cors())


app.post('/upload/', (res, req) => {
    console.log(req.files)
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