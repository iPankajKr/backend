const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());
app.use(cors());

// Import the Course model
const Course = require('./models/Course');

dotenv.config();

const mongoURI = process.env.MONGO_URI;

console.log("MongoDB URI:", mongoURI);

if (!mongoURI) {
  console.error("MongoDB URI is not defined. Please set the MONGO_URI environment variable.");
  process.exit(1);
}

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB Atlas
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const db = client.db('course-platform-db');

    // Create a collection and insert a document to ensure the database is created
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'Database initialization' });

    console.log("Database 'course-platform-db' initialized");

    return db;
  }
  catch (err) {
    console.error("Error connecting to MongoDB Atlas", err);
  }
}

// Call the function to connect to MongoDB
connectToDatabase();

// Define your routes here
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// CRUD routes for courses

// Create a new course
app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body); // Create a new Course instance with the request body
    await course.save(); // Save the course to the database
    res.status(201).json(course); // Respond with the created course and a 201 status code
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status code and error message if there's an error
  }
});

// Retrieve all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find(); // Retrieve all courses from the database
    res.json(courses); // Respond with the list of courses
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code and error message if there's an error
  }
});

// Update a course by ID
app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Find and update the course
    if (!course) {
      return res.status(404).json({ error: 'Course not found' }); // Respond with a 404 status code if the course is not found
    }
    res.json(course); // Respond with the updated course
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status code and error message if there's an error
  }
});

// Delete a course by ID
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id); // Find and delete the course
    if (!course) {
      return res.status(404).json({ error: 'Course not found' }); // Respond with a 404 status code if the course is not found
    }
    res.json({ message: 'Course deleted' }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code and error message if there's an error
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});