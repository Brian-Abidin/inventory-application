const multer = require("multer");
const path = require("path");

// config multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // makes sure images directory exists
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename with extension (like .txt) with .extname
    const fname = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fname);
  }
});

// initialize upload middleware
const upload = multer({ storage });

module.exports = {
  upload
};
