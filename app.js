//import express framework to create backend server (routes, middleware, etc)
const express = require('express');
//a secure file with all the private keys
const dotenv = require('dotenv');
//allows to req from different origins (like frontend on different port)
const cors = require('cors');
//to read and parse JSON data coming from POST req
const bodyParser = require('body-parser');
//Connection with mongoDB database
const connectDB = require('./config/db');
//import the function from controllers
const {
  addFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');

const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');

app.use('/api', authRoutes);
app.use('/api', faqRoutes);

//loading .env
dotenv.config();

//Connecting Database
connectDB();

//create an instance of express app (this is our backend server obj)
const app = express();

//enabling CORS to connect frontend with backend
app.use(cors());

//Enables the JSON Parsing for incoming req bodies
//This is required so req.body works correctly
app.use(bodyParser.json());

//Routes
app.use('/api', require('./routes/faqRoutes'));

//Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
