/**
 * Extension Packaging Script
 * 
 * This Node.js script packages the extension files into a zip file
 * for easy download and distribution.
 * 
 * Usage:
 * 1. Install Node.js
 * 2. Run "npm install archiver" to install the archiver package
 * 3. Run "node package-extension.js" to create the ZIP file
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Define paths
const extensionDir = path.join(__dirname, 'extension');
const outputDir = path.join(__dirname, 'downloads');
const outputFile = path.join(outputDir, 'email-scam-protector.zip');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Create a file to stream archive data to
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
    console.log('Extension packaged successfully!');
    console.log(`Archive size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`File saved to: ${outputFile}`);
});

// Handle warnings
archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        console.warn('Warning:', err);
    } else {
        throw err;
    }
});

// Handle errors
archive.on('error', function(err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files from the extension directory
archive.directory(extensionDir, false);

// Finalize the archive
archive.finalize();

console.log('Creating extension package...');