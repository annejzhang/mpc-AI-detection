require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const API_KEY = process.env.ROBOFLOW_API_KEY;
const MODEL_ENDPOINT = process.env.ROBOFLOW_MODEL_ENDPOINT;
const IMAGE_PATH = 'ScaleWidthWyI1MDAiXQ-moth-plant-2002.jpeg';

async function testRoboflowForm() {
  const form = new FormData();
  form.append('image', fs.createReadStream(IMAGE_PATH));

  const url = `${MODEL_ENDPOINT}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    console.log('Status:', response.status, response.statusText);
    const text = await response.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testRoboflowForm(); 