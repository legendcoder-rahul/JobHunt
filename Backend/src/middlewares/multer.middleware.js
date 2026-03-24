const multer = require('multer');

// Use memory storage to keep the file buffer in memory
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
    // Accept PDF and DOCX files
    const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
upload.errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Max 10MB allowed.' });
        }
    }
    if (err?.message?.includes('only')) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
};

module.exports = upload;