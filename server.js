require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files
app.use(express.static('.'));

// Your Roboflow API key and model endpoint
// Replace these with your actual Roboflow API key and model endpoint
const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY || 'YOUR_ROBOFLOW_API_KEY'; // Get this from your Roboflow account
const MODEL_ENDPOINT = process.env.ROBOFLOW_MODEL_ENDPOINT || 'https://detect.roboflow.com/YOUR_WORKSPACE/YOUR_MODEL/VERSION';
// Example: https://detect.roboflow.com/my-workspace/object-detection/1

app.post('/analyze', upload.single('image'), async (req, res) => {
    console.log('Received analyze request');
    try {
        if (!req.file) {
            console.log('No file received');
            return res.status(400).json({ error: 'No image uploaded' });
        }

        console.log('File received:', {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });

        // Convert image buffer to base64
        const base64Image = req.file.buffer.toString('base64');

        // Make request to Roboflow API as base64 POST
        console.log('Making request to Roboflow API:', MODEL_ENDPOINT);
        console.log('API Key:', ROBOFLOW_API_KEY);
        console.log('File details:', {
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype
        });

        const response = await fetch(
            `${MODEL_ENDPOINT}?api_key=${ROBOFLOW_API_KEY}`,
            {
                method: 'POST',
                body: base64Image,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log('Roboflow API response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Roboflow API error:', errorText);
            throw new Error(`Roboflow API error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Successfully processed image');
        res.json(result);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add a test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running correctly' });
});

// Validate configuration
if (ROBOFLOW_API_KEY === 'YOUR_ROBOFLOW_API_KEY') {
    console.error('❌ Please configure your Roboflow API key in the .env file or environment variables');
    console.error('   Get your API key from: https://app.roboflow.com/settings/api');
    process.exit(1);
}

if (MODEL_ENDPOINT.includes('YOUR_WORKSPACE')) {
    console.error('❌ Please configure your Roboflow model endpoint in the .env file or environment variables');
    console.error('   Get your model endpoint from your model\'s deploy page');
    process.exit(1);
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`🔗 Using Roboflow model: ${MODEL_ENDPOINT}`);
    console.log(`🔑 API Key configured: ${ROBOFLOW_API_KEY ? 'Yes' : 'No'}`);
}); 