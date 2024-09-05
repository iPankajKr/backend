const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const prisma = new PrismaClient(); // Instantiate Prisma Client

// Define your routes here
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// CRUD routes for courses

// Create a new course
app.post('/api/courses', async (req, res) => {
  try {
    const existingCourse = await prisma.course.findUnique({ where: { title: req.body.title } });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course already exists' });
    }

    const course = await prisma.course.create({ data: req.body }); // Use Prisma to create a new course
    res.status(201).json(course); // Respond with the created course and a 201 status code
  } catch (error) {
    console.error("Error saving course:", error); // Log the error
    res.status(400).json({ error: error.message }); // Respond with a 400 status code and error message if there's an error
  }
});

// Retrieve all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany(); // Use Prisma to retrieve all courses
    res.json(courses); // Respond with the list of courses
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code and error message if there's an error
  }
});

// Update a course by ID
app.put('/api/courses/:id', async (req, res) => {
  // Check if the provided ID is a valid ObjectId
  const courseId = req.params.id; // Assuming ID is a string, adjust if necessary
  try {
    const course = await prisma.course.update({
      where: { id: courseId },
      data: req.body,
    }); // Use Prisma to find and update the course
    res.json(course); // Respond with the updated course
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respond with a 400 status code and error message if there's an error
  }
});

// Delete a course by ID
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.delete({ where: { id: req.params.id } }); // Use Prisma to find and delete the course
    res.json({ message: 'Course deleted' }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ error: error.message }); // Respond with a 500 status code and error message if there's an error
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});