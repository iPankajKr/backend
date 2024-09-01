const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch(err) {
    console.error("Error connecting to MongoDB Atlas", err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Call the function to connect to MongoDB
connectToDatabase();

// Define your routes here
app.get('/', (req, res) => {
    res.send('Backend is running...');
  });

app.listen(4000, () => {
    console.log('Server is running on port 4000');
})