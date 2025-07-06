// Constants
const API_URL = 'https://mpc-ai-detection.onrender.com';

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
            // Format results in English
            let html = `<div><strong>Request ID:</strong> ${data.inference_id}<br>`;
            html += `<strong>Processing time:</strong> ${data.time.toFixed(3)} seconds<br>`;
            html += `<strong>Image size:</strong> ${data.image.width} x ${data.image.height} pixels<br>`;
            const count = data.predictions ? data.predictions.length : 0;
            html += `<strong>Moth plants detected:</strong> ${count}<br>`;
            if (count > 0) {
                html += `<strong>Detections:</strong><ol>`;
                data.predictions.forEach((pred, idx) => {
                    html += `<li>`;
                    html += `<strong>Type:</strong> ${pred.class}<br>`;
                    html += `<strong>Location (center):</strong> x = ${pred.x}, y = ${pred.y}<br>`;
                    html += `<strong>Size:</strong> ${pred.width} x ${pred.height} pixels<br>`;
                    html += `<strong>Confidence:</strong> ${(pred.confidence * 100).toFixed(1)}%<br>`;
                    html += `<strong>Class ID:</strong> ${pred.class_id}<br>`;
                    html += `<strong>Detection ID:</strong> ${pred.detection_id}`;
                    html += `</li>`;
                });
                html += `</ol>`;
            } else {
                html += `<strong>Detections:</strong> None found.`;
            }
            html += `</div>`;

            // Add a key/legend for the red box
            let legend = `<div style="margin-top:10px;"><span style="display:inline-block;width:20px;height:20px;border:2px solid #ff0000;vertical-align:middle;"></span> = Moth plant</div>`;
            results.innerHTML = html + legend;

            // Draw bounding boxes on canvas
            const uploadedImage = document.getElementById('uploadedImage');
            const canvas = document.getElementById('resultsCanvas');
            if (uploadedImage && canvas) {
                // Get natural and displayed sizes
                const naturalWidth = uploadedImage.naturalWidth;
                const naturalHeight = uploadedImage.naturalHeight;
                const displayWidth = uploadedImage.width;
                const displayHeight = uploadedImage.height;
                // Set canvas size to match displayed image size
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                canvas.style.width = displayWidth + 'px';
                canvas.style.height = displayHeight + 'px';
                canvas.style.display = 'block';
                // Position canvas over image (relative positioning in container)
                canvas.style.left = uploadedImage.offsetLeft + 'px';
                canvas.style.top = uploadedImage.offsetTop + 'px';
                // Calculate scale factors
                const scaleX = displayWidth / naturalWidth;
                const scaleY = displayHeight / naturalHeight;
                // Draw boxes
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (data.predictions && data.predictions.length > 0) {
                    data.predictions.forEach(pred => {
                        // Scale coordinates from natural to displayed size
                        const x = (pred.x - pred.width / 2) * scaleX;
                        const y = (pred.y - pred.height / 2) * scaleY;
                        const w = pred.width * scaleX;
                        const h = pred.height * scaleY;
                        ctx.strokeStyle = '#ff0000';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x, y, w, h);
                        // No label inside the box
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            results.innerHTML = `<div style="color: #ef4444;">Error: ${error.message}</div>`;
        } finally {
            analyzeButton.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    });
}); 
