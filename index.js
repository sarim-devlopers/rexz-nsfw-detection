const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

// Define API endpoint and timeout configuration
const API_URL = " http://13.201.42.191:5000/classify"; // Example Flask backend URL
const TIMEOUT = 10000; // 10 seconds timeout

/**
 * Classifies an image as NSFW or SFW.
 * @param {string} imagePath - Path to the input image.
 * @returns {Promise<Object>} - Promise resolving to classification results.
 */
async function classifyImage(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error("Image file does not exist. Please provide a valid path.");
  }

  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: TIMEOUT,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      `Error classifying image: ${error.response?.data?.message || error.message}`
    );
  }
}

module.exports = classifyImage;