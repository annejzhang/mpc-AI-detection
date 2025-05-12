const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-deployed-backend-url.com'  // Replace with your deployed backend URL
    : 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const analyzeButton = document.getElementById('analyzeButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const results = document.getElementById('results');

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2563eb';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#e2e8f0';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#e2e8f0';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            imageInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });

    // Handle file selection
    imageInput.addEventListener('change', handleFileSelect);

    function handleFileSelect() {
        const file = imageInput.files[0];
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
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            results.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            results.innerHTML = `<div style="color: #ef4444;">Error: ${error.message}</div>`;
        } finally {
            analyzeButton.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    });
}); 