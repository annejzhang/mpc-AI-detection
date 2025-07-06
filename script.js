// Constants
const API_URL = 'https://mpc-ai-detection.onrender.com/';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const results = document.getElementById('results');

    // Add console logs for debugging
    console.log('Script loaded');

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2563eb';
        console.log('File dragged over');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#e2e8f0';
        console.log('File dragged out');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#e2e8f0';
        console.log('File dropped');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            imageInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });

    // Handle file selection
    imageInput.addEventListener('change', handleFileSelect);

    function handleFileSelect() {
        const file = imageInput.files[0];
        console.log('File selected:', file);
        
        if (file && file.type.startsWith('image/')) {
            analyzeButton.disabled = false;
            // Preview the image
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('uploadedImage').src = e.target.result;
                document.getElementById('uploadedImage').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            analyzeButton.disabled = true;
        }
    }

    // Handle image analysis
    analyzeButton.addEventListener('click', async () => {
        const file = imageInput.files[0];
        if (!file) return;

        // Show loading state
        analyzeButton.disabled = true;
        loadingIndicator.style.display = 'flex';
        results.innerHTML = '';

        const formData = new FormData();
        formData.append('image', file);

        try {
            console.log('Sending request to server...');
            const response = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                throw new Error(`Server error: ${response.status}\n${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            results.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            console.error('Error:', error);
            results.innerHTML = `<div style="color: #ef4444;">Error: ${error.message}</div>`;
        } finally {
            analyzeButton.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    });
}); 
