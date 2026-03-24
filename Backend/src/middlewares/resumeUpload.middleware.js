const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

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

const resumeUpload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for resumes
    },
    fileFilter: fileFilter
});

// Middleware to upload resume to ImageKit using REST API
const uploadResumeToImageKit = async (req, res, next) => {
    try {
        if (!req.file) {
            console.log('⏭️  No resume file provided, skipping upload');
            return next();
        }

        const file = req.file;
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

        if (!publicKey || !privateKey) {
            console.warn('⚠️  Missing ImageKit credentials, will use existing resume');
            return next();
        }

        console.log('📤 Starting Resume upload to ImageKit...');
        console.log('File name:', file.originalname);
        console.log('File size:', file.size, 'bytes');

        // Create FormData
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });
        formData.append('fileName', `resume_${req.id}_${Date.now()}`);
        formData.append('folder', '/JobHunter/Resumes/');

        // Create auth header
        const auth = Buffer.from(`${publicKey}:${privateKey}`).toString('base64');
        
        console.log('🔐 Auth header created');

        // Upload to ImageKit
        const response = await axios.post(
            'https://upload.imagekit.io/api/v1/files/upload',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Basic ${auth}`
                },
                timeout: 30000
            }
        );

        if (response.data && response.data.url) {
            req.uploadedResumeUrl = response.data.url;
            req.resumeOriginalName = file.originalname;
            console.log('✅ Resume upload successful:', response.data.url);
        }
        next();
    } catch (error) {
        console.warn('⚠️  Resume upload failed, continuing...');
        console.warn('Error:', error.message);
        if (error.response) {
            console.warn('Status:', error.response.status);
            console.warn('Message:', error.response.data?.message);
        }
        // Continue to next middleware/controller without failing
        next();
    }
};

module.exports = { resumeUpload, uploadResumeToImageKit };
