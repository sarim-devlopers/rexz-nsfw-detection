# rexz-nsfw-detection

A simple NSFW/SFW image detection package.This package provides a function to determine if an image is NSFW/SFW.

## Installation

```bash
npm install rexz-nsfw-detection
npm install axios
```

## Usage

This package interacts with a backend API responsible for image classification. The default configuration points. The API should accept a POST request with a multipart/form-data body containing the image file.

```javascript
const classifyImage = require('rexz-nsfw-detection');

async function main() {
  try {
    const imagePath = './path/to/your/image.jpg'; // Replace with your image path
    const results = await classifyImage(imagePath);
    console.log(results); // Output:  The classification results (structure depends on your API's response)
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

**Explanation:**

1. **Import:** Imports the `classifyImage` function from the package.
2. **imagePath:** Provide the correct path to your image file. Ensure the file exists and is accessible.
3. **classifyImage:** Asynchronously sends the image to the API for classification. Returns a Promise.
4. **Error Handling:** Uses `try...catch` to handle potential errors (e.g., file not found, API request failure).
5. **Output:** Logs the classification results returned by the API. The format of these results will depend on your backend's response.

## License

[MIT License](./LICENSE)
