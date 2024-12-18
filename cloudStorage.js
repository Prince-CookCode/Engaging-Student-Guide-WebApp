const { Storage } = require('@google-cloud/storage');
require('dotenv').config(); // Load environment variables

// Google Cloud Storage setup
const storage = new Storage({ keyFilename: process.env.GOOGLE_CLOUD_KEYFILE });
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(file.originalname);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('error', (err) => {
            reject(new Error('Error uploading file to Google Cloud Storage:', err));
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        });

        blobStream.end(file.buffer);
    });
};

module.exports = { uploadFile };
