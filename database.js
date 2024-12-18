const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User Schema (Student)
const studentSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: {
        rank: { type: Number, default: 0 },
        quizCompleted: { type: Number, default: 0 },
        docRead: { type: Number, default: 0 },
        quizScores: { type: Map, of: Number, default: {} }  // Default to empty object
    }
}, { collection: 'Students' });


const Student = mongoose.model('Student', studentSchema);

// Resource Schema
const resourceSchema = new mongoose.Schema({
    name: String,
    description: String,
    authorName: String,
    category: String,
    pdfLink: String,
    audioLink: String,
    videoLink: String
}, { collection: 'Resources' });

const Resource = mongoose.model('Resource', resourceSchema);

// Quiz Schema
const quizSchema = new mongoose.Schema({
    name: String,
    quiz: [
        {
            questionText: String,
            options: [String],
            correctAnswer: String
        }
    ]
}, { collection: 'Quizzes' });

const Quiz = mongoose.model('Quiz', quizSchema);

// Authenticate User
const authenticateUser = async (username, password) => {
    try {
        const user = await Student.findOne({ username });
        if (user && user.password === password) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { userId: user._id, token };
        } else {
            return null;
        }
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    }
};

// Authenticate Token Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Store Resource in DB
const storeResourceInDB = async (name, description, authorName, category, pdfLink, audioLink, videoLink) => {
    const resource = new Resource({
        name,
        description,
        authorName,
        category,
        pdfLink,
        audioLink,
        videoLink
    });

    await resource.save();
};

// Fetch All Resources
const fetchAllResources = async () => {
    try {
        const resources = await Resource.find({});
        return resources.map(resource => ({
            id: resource._id.toString(),
            title: resource.name,
            description: resource.description,
            authorName: resource.authorName,
            pdfLink: resource.pdfLink,
            audioLink: resource.audioLink,
            videoLink: resource.videoLink
        }));
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
};

// Search Resource by Name
const searchResourceByName = async (name) => {
    const resources = await fetchAllResources();
    return resources.filter(resource => 
        resource.title.toLowerCase().includes(name.toLowerCase())
    );
};

// Get Resource by ID
const getResource = async (id) => {
    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            throw new Error('Resource not found');
        }
        return resource;
    } catch (err) {
        console.error('Error fetching resource:', err);
        throw err;
    }
};

// Get Resource Name by ID
const getResourceNameById = async (id) => {
    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            throw new Error('Resource not found');
        }
        return resource.name; // Return the name of the resource
    } catch (err) {
        console.error('Error fetching resource name:', err);
        throw err;
    }
};

// Get Quiz by Resource Name
const getQuizByResourceName = async (resourceName) => {
    try {
        const quiz = await Quiz.findOne({ name: resourceName });
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        return quiz;
    } catch (err) {
        console.error('Error fetching quiz:', err);
        throw err;
    }
};

// Function to update the student's quiz score
const updateStudentScore = async (studentId, resourceId, score) => {
    try {
        console.log(`Updating score for studentId: ${studentId}, resourceId: ${resourceId}, score: ${score}`);

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            console.error('Student not found');
            return null; // Student not found
        }

        // Get the resource name using the resourceId
        const resourceName = await getResourceNameById(resourceId);

        // Initialize quizScores if it doesn't exist
        if (!student.progress.quizScores) {
            student.progress.quizScores = new Map();
        }

        // Update or add the quiz score using the resource name
        student.progress.quizScores.set(resourceName, score);

        // Update the number of quizzes completed
        student.progress.quizCompleted = student.progress.quizScores.size;

        // Save the updated student document
        const updatedStudent = await student.save();
        console.log(`Updated student: ${updatedStudent}`);
        return updatedStudent;
    } catch (error) {
        console.error('Error updating student score:', error);
        throw error;
    }
};

module.exports = { 
    Student,
    authenticateUser, 
    authenticateToken, 
    storeResourceInDB, 
    getResource, 
    fetchAllResources, 
    searchResourceByName, 
    getQuizByResourceName, 
    updateStudentScore
};
