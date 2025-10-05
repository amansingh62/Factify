// Imported the required packages
const multer = require("multer");

// File upload to cloud
const storage = multer.memoryStorage();

// Logic for file upload
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/mpeg"];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Only image/video files allowed"));
    },
});

// Exported the file upload 
module.exports = upload;