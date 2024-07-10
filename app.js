const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config');
const questionRoutes = require('./routes/question.js'); 
const Question = require('./models/question.js'); 
const answerRoutes = require('./routes/answer');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/question.js', questionRoutes);
app.use('/answer', answerRoutes);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect(config.mongoURI).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/question', questionRoutes);
app.use('/answer', require('./routes/answer'));

// Root route
app.get('/', async (req, res) => {
    try {
      const questions = await Question.find().populate('user', 'username');
      res.render('index', { questions: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).send('An error occurred while fetching questions');
    }
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));