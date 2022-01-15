const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if ( file.filename !== 'emptyfile') {
      cb(null, './public/images/');
    }
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString();
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5
}});

module.exports.upload = upload;
