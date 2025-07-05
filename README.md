# Roboflow Model API Integration

This application allows you to upload images from your computer and analyze them using your Roboflow model via API.

## Features
- Drag & drop or select an image from your computer
- Image is sent to your Node.js backend
- Backend converts the image to base64 and POSTs it to Roboflow using the correct content type
- Results are displayed in the browser
- Secure: API keys are never committed to git or exposed to the frontend

## Setup Instructions

### 1. Get Your Roboflow API Credentials
- **API Key**: Go to [Roboflow Settings](https://app.roboflow.com/settings/api) and copy your API key
- **Model Endpoint**: Go to your model in Roboflow → Deploy → API and copy the endpoint URL (e.g. `https://serverless.roboflow.com/your-workspace/your-model/1`)

### 2. Configure Environment Variables
- Create a `.env` file in the root directory (do **not** commit this file!):
  ```env
  ROBOFLOW_API_KEY=your_actual_api_key_here
  ROBOFLOW_MODEL_ENDPOINT=https://serverless.roboflow.com/your-workspace/your-model/1
  ```
- `.env` is already in `.gitignore` for your safety.
- Optionally, provide a `.env.example` (with placeholder values) for collaborators.

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server Locally
```bash
npm start
```
- The server will run at `http://localhost:3000`
- Open your browser to `http://localhost:3000`

## How It Works
1. User uploads an image via the web UI
2. The backend receives the image, converts it to base64, and POSTs it to Roboflow with `Content-Type: application/x-www-form-urlencoded`
3. Roboflow returns predictions, which are displayed in the browser

## Deployment to Render
1. Push your code to GitHub (without `.env`)
2. Create a new Web Service on [Render](https://render.com/)
3. In the Render dashboard, set your environment variables (`ROBOFLOW_API_KEY`, `ROBOFLOW_MODEL_ENDPOINT`) in the **Environment** tab
4. Deploy! Render will inject these variables at runtime

## Security Best Practices
- **Never commit your `.env` file** (it is in `.gitignore`)
- Use the Render dashboard to set secrets in production
- Share only a `.env.example` with placeholder values if needed

## Troubleshooting
- **500 Internal Server Error**: Check your API key, endpoint, and that your model supports base64 POST
- **414 Request-URI Too Large**: Do not use base64 in the URL for large images; use POST body as implemented
- **No predictions**: The model may not detect anything in the image; try another image

## Example Response
```
{
  "inference_id": "...",
  "image": { "width": 500, "height": 314 },
  "predictions": [
    { "x": 314.5, "y": 102.0, "width": 99.0, "height": 124.0, "confidence": 0.54, "class": "moth-plant-pods" }
  ]
}
```

---

**Phase 1 complete: Local image upload, secure Roboflow integration, ready for cloud deployment!**
