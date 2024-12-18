const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const { Types } = require('mongoose');
const { Student } = require('./database');

const { uploadResource } = require('./resourceController');
const { authenticateUser, authenticateToken, getResource, fetchAllResources, searchResourceByName, getQuizByResourceName, updateStudentScore } = require('./database');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


// MongoDB Connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        });
        console.log('Connected to MongoDB');
        await fetchAllResources(); // Preload resources into memory
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

connectToDatabase();

// File Upload Configuration
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
    return Types.ObjectId.isValid(id);
};

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await authenticateUser(username, password);
        if (result) {
            const { userId, token } = result;
            const adminId = '66d8c918d44233e8d7df0c51';
            const isAdmin = userId.toString() === adminId;

            console.log(`UserId: ${userId}`);
            console.log(`Token: ${token}`);
            console.log(`IsAdmin: ${isAdmin}`);

            res.json({ userId, token, isAdmin });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Resource Upload Route (Protected)
app.post('/upload-resource', authenticateToken, upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadResource);

// Get Resource by ID
app.get('/api/resources/:id', async (req, res) => {
    try {
        const resourceId = req.params.id;
        if (!isValidObjectId(resourceId)) {
            return res.status(400).json({ message: 'Invalid resource ID' });
        }
        const resource = await getResource(resourceId);
        const responseData = {
            Name: resource.name,
            pdfUrl: resource.pdfLink,
            videoUrl: resource.videoLink,
            audioUrl: resource.audioLink,
            summaryText: "",
            Brief: resource.description,
            releaseInfo: `Released by ${resource.authorName}`
        };
        res.json(responseData);
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Search Resource by Name
app.get('/api/search-resource/:name', async (req, res) => {
    const resourceName = req.params.name;
    try {
        const results = await searchResourceByName(resourceName);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        console.error('Error searching resource:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Quiz by Resource ID
app.get('/api/quizzes/:id', async (req, res) => {
    try {
        const resourceId = req.params.id;
        if (!isValidObjectId(resourceId)) {
            return res.status(400).json({ message: 'Invalid resource ID' });
        }

        const resource = await getResource(resourceId);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const quiz = await getQuizByResourceName(resource.name);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Student Quiz Score
app.post('/api/students/updateScore', authenticateToken, async (req, res) => {
    const { resourceId, score } = req.body;
    const studentId = req.user.userId;

    try {
        if (!isValidObjectId(resourceId)) {
            return res.status(400).json({ message: 'Invalid resource ID' });
        }

        const updatedStudent = await updateStudentScore(studentId, resourceId, score);
        if (updatedStudent) {
            res.status(200).json({ message: 'Score updated successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error updating student score:', error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});


// Fetch Student Progress (for Dashboard)
app.get('/api/students/progress/:id', authenticateToken, async (req, res) => {
    const studentId = req.params.id;

    try {
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID' });
        }

        // Fetch the student progress data from the database
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Send only the relevant progress data (e.g., quizScores)
        res.json(student.progress);
    } catch (error) {
        console.error('Error fetching student progress:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
