const express = require('express');
const Question = require('../models/question');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Post a new question
router.get('/ask', authenticate, (req, res) => {
  res.render('question');
});

router.post('/ask', authenticate, async (req, res) => {
  const { title, description } = req.body;
  try {
    const question = new Question({ title, description, user: req.user._id });
    await question.save();
    res.redirect('/');
  } catch (err) {
    res.status(400).send(err);
  }
});

// View all questions
router.get('/', async (req, res) => {
    console.log('Fetching questions');
    const questions = await Question.find().populate('user');
    console.log('Questions fetched:', questions);
    res.render('index', { questions });
  });

  router.get('/:id', async (req, res) => {
    try {
      const question = await Question.findById(req.params.id).populate('user', 'username');
      if (!question) {
        return res.status(404).send('Question not found');
      }
      res.render('question_detail', { question });
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).send('An error occurred while fetching the question');
    }
  });

module.exports = router;