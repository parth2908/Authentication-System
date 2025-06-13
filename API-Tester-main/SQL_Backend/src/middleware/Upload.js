const multer = require('multer');
const path = require('path');

// Set storage strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store in /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const ext = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = fileTypes.test(file.mimetype);
  if (ext && mime) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
