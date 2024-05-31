const express = require('express');
const protect = require('../Middlewares/authMiddleware');

const router = express.Router();

const {
  createTest,
  getAllTests,
  getTestsBySubject,
  getTestById,
  submitTestResults,
  getResult,
  getUserResults
} = require('../controllers/quizController');

// Route to create a new test
router.post('/create', protect, createTest);

// Route to fetch all tests
router.get('/', getAllTests);

// Route to fetch tests by subject
router.get('/subject/:subject', getTestsBySubject);

// Route to fetch a specific test by ID
router.get('/:id', getTestById);

// Route to submit test results
router.post('/submit', protect, submitTestResults);

// Route to fetch the result of a specific test for the logged-in user
router.get('/result/:testId', protect, getResult);

// Route to fetch all previous results for the logged-in user
router.get('/user/results', protect, getUserResults);

module.exports = router;
