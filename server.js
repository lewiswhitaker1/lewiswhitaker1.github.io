const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit per file
    }
});

// Handle file uploads
app.post('/upload', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), async (req, res) => {
    try {
        // Verify reCAPTCHA token
        const recaptchaToken = req.headers.authorization?.split(' ')[1];
        if (!recaptchaToken) {
            return res.status(401).json({ error: 'Missing reCAPTCHA token' });
        }

        // Verify reCAPTCHA token with Google
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `secret=YOUR_RECAPTCHA_SECRET_KEY&response=${recaptchaToken}`
        });

        const recaptchaData = await recaptchaResponse.json();
        if (!recaptchaData.success) {
            return res.status(401).json({ error: 'Invalid reCAPTCHA token' });
        }

        // Process uploaded files
        const files = req.files;
        const textLines = JSON.parse(req.body.textLines || '{}');

        // Generate a unique reference code
        const referenceCode = uuidv4().slice(0, 8).toUpperCase();

        // Store the reference code and file information
        const orderData = {
            referenceCode,
            files: files ? Object.keys(files).map(key => ({
                field: key,
                filename: files[key][0].filename,
                path: files[key][0].path
            })) : [],
            textLines,
            timestamp: new Date().toISOString()
        };

        // Save order data to a JSON file
        const ordersDir = 'orders';
        if (!fs.existsSync(ordersDir)) {
            fs.mkdirSync(ordersDir);
        }
        fs.writeFileSync(
            path.join(ordersDir, `${referenceCode}.json`),
            JSON.stringify(orderData, null, 2)
        );

        // Return success response with reference code
        res.json({ 
            success: true, 
            code: referenceCode,
            message: 'Files uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            error: 'Failed to process upload',
            details: error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 