const { uploadFile } = require('./cloudStorage');
const { storeResourceInDB } = require('./database');
require('dotenv').config(); // Load environment variables

const uploadResource = async (req, res) => {
    const { name, description, authorName, category } = req.body;
    const files = req.files;

    if (!files || (!files.pdf && !files.audio && !files.video)) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const fileLinks = {};

        // Upload each file type to Google Cloud Storage
        for (let fileType in files) {
            const file = files[fileType][0];
            const publicUrl = await uploadFile(file);
            fileLinks[`${fileType}Link`] = publicUrl;
        }

        // Store the resource in MongoDB after all files are uploaded
        await storeResourceInDB(name, description, authorName, category, fileLinks.pdfLink, fileLinks.audioLink, fileLinks.videoLink);
        res.status(200).json({ message: 'Resource stored successfully', fileLinks });

    } catch (error) {
        console.error('Error storing resource:', error);
        res.status(500).json({ error: 'Failed to store resource' });
    }
};

module.exports = { uploadResource };