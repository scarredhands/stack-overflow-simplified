const express = require('express');
const Answer = require('../models/answer');
const Question = require('../models/question');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Post a new answer
router.post('/:questionId', authenticate, async (req, res) => {
  const { text } = req.body;
  const { questionId } = req.params;
  try {
    const answer = new Answer({ text, question: questionId, user: req.user._id });
    await answer.save();
    res.redirect(`/question/${questionId}`);
  } catch (err) {
    res.status(400).send(err);
  }
});

// View a question and its answers
router.get('/:questionId', async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.findById(questionId).populate('user');
  const answers = await Answer.find({ question: questionId }).populate('user');
  res.render('answer', { question, answers });
});

module.exports = router;
