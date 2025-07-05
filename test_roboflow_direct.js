require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const API_KEY = process.env.ROBOFLOW_API_KEY;
const MODEL_ENDPOINT = process.env.ROBOFLOW_MODEL_ENDPOINT;
const IMAGE_URL = 'https://www.hastingsdc.govt.nz/assets/Articles/_resampled/ScaleWidthWyI1MDAiXQ-moth-plant-2002.JPG';

async function testRoboflowUrl() {
  const url = `${MODEL_ENDPOINT}?api_key=${API_KEY}&image=${encodeURIComponent(IMAGE_URL)}`;
  const response = await fetch(url, { method: 'POST' });
  console.log('Status:', response.status, response.statusText);
  const text = await response.text();
  console.log('Response:', text);
}

testRoboflowUrl(); 