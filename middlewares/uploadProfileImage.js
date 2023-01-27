const multer = require("multer");
//===================================================
const storage = multer.diskStorage({
  destination:"uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
//------------------------------
const uploadProfileImage = multer({
  storage: storage,
});
//====================================
module.exports = uploadProfileImage;
