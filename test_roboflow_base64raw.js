require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');

const API_KEY = process.env.ROBOFLOW_API_KEY;
const MODEL_ENDPOINT = process.env.ROBOFLOW_MODEL_ENDPOINT.replace(/\/\d+$/, '/2'); // force version 2
const IMAGE_PATH = 'ScaleWidthWyI1MDAiXQ-moth-plant-2002.jpeg';

async function testRoboflowBase64Raw() {
  const imageBuffer = fs.readFileSync(IMAGE_PATH);
  const base64Image = imageBuffer.toString('base64');

  const url = `${MODEL_ENDPOINT}?api_key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    body: base64Image,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  console.log('Status:', response.status, response.statusText);
  const text = await response.text();
  console.log('Response:', text);
}

testRoboflowBase64Raw(); 