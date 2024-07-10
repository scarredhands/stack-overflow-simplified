const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const questions = await Question.find({ user: user._id }).sort('date');
    const answers = await Answer.find({ user: user._id })
      .populate('question', 'title')
      .sort('date');

    res.render('profile', { user, questions, answers });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('An error occurred while fetching the user profile');
  }
});

module.exports = router;