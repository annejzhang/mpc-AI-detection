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
const ROBOFLOW_API_KEY = 'JbojUbrxTiqgIAZZ2yNM';
const MODEL_ENDPOINT = 'https://detect.roboflow.com/mpc-ai-detection/1';

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

        // Create form data for Roboflow API
        const formData = new FormData();
        formData.append('image', req.file.buffer, req.file.originalname);

        // Make request to Roboflow API
        console.log('Making request to Roboflow API:', MODEL_ENDPOINT);
        const response = await fetch(
            `${MODEL_ENDPOINT}?api_key=${ROBOFLOW_API_KEY}`,
            {
                method: 'POST',
                body: formData
            }
        );

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Using MODEL_ENDPOINT: ${MODEL_ENDPOINT}`);
}); 