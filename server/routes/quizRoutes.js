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
  getUserResults,
  canStartTest // New controller for checking if user can start the test
} = require('../controllers/quizController');

// Route to create a new test
router.post('/create', protect, createTest);

// Route to fetch all tests
router.get('/', getAllTests);

// Route to fetch tests by subject
router.get('/subject/:subject', getTestsBySubject);

// Route to fetch a specific test by ID
router.get('/:id', protect, getTestById);

// Route to check if the user can start the test
router.get('/canstart/:testId', protect, canStartTest);

// Route to submit test results
router.post('/submit', protect, submitTestResults);

// Route to fetch the result of a specific test for the logged-in user
router.get('/result/:testId', protect, getResult);

// Route to fetch all previous results for the logged-in user
router.get('/user/results', protect, getUserResults);

module.exports = router;
