const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Use memory storage to keep the file buffer in memory
const storage = multer.memoryStorage();

const imageUpload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    },
});

// Middleware to upload to ImageKit using REST API
const uploadToImageKit = async (req, res, next) => {
    try {
        if (!req.file) {
            console.log(' No file provided, skipping upload');
            return next();
        }

        const file = req.file;
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

       // Create FormData
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype


        });
        formData.append('fileName', `profile_${req.body.email || 'user'}_${Date.now()}`);
        formData.append('folder', '/JobHunter/ProfilePhotos/');

        // Create auth header - Base64 encode publicKey:privateKey
        const authString = `${publicKey}:${privateKey}`;
        const auth = Buffer.from(authString).toString('base64');
        
        console.log('🔐 Auth string:', authString.substring(0, 30) + '...');
        console.log('🔐 Auth header (base64):', auth.substring(0, 30) + '...');

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
            req.uploadedFileUrl = response.data.url;
            console.log('✅ ImageKit upload successful:', response.data.url);
        }
        next();
    } catch (error) {
        console.error('❌ ImageKit upload failed!');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Status Text:', error.response.statusText);
            console.error('Response data:', error.response.data);
        }
        // Continue to next middleware/controller without failing
        next();
    }
};

module.exports = { imageUpload, uploadToImageKit };
