import multer from 'multer';


// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/uploads'); // Change the destination directory as per your requirement
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});

// Initialize multer middleware
const upload = multer({ storage: storage });

export default upload;