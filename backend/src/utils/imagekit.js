// Imported required pacakge
const ImageKit = require("imagekit");
require("dotenv").config();

// Setup for imagekit environment variables
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Exported the imagekit
module.exports = imageKit;
