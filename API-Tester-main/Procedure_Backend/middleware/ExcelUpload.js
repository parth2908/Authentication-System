const multer = require("multer");
const path = require("path");
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // You may need to create this folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
 
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    cb(null, true);
  } else {
    cb(new Error("Only .xlsx files are allowed"), false);
  }
};
 
const upload = multer({ storage, fileFilter });
 
module.exports = upload;