const Test = require('../model/Test');
const Question = require('../model/Question');
const Result = require('../model/Result');

module.exports.createTest = async (req, res) => {
  try {
    const { title, subject, timeLimit, questions } = req.body;

    if (!title || !subject || !timeLimit || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'All fields are required, including at least one question with valid options.' });
    }

    const existingTest = await Test.findOne({ title });
    if (existingTest) {
      return res.status(400).json({ message: 'Test with this title already exists.' });
    }

    const questionIds = [];
    for (const questionData of questions) {
      const options = questionData.options.map(option => ({
        text: option,
        isCorrect: questionData.options.indexOf(option) === questionData.correctIndex
      }));

      const question = new Question({
        text: questionData.text,
        options: options,
        test: null 
      });

      await question.save();
      questionIds.push(question._id);
    }

    const test = new Test({
      title,
      subject,
      creator: req.user._id,
      timeLimit,
      questions: questionIds,
    });

    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch all tests
module.exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate('creator', 'username').populate('questions');
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch tests by subject
module.exports.getTestsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const tests = await Test.find({ subject }).populate('creator', 'username').populate('questions');
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch a single test
module.exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).populate('creator', 'username').populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    res.status(200).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports.canStartTest = async (req, res) => {
  try {
    const testId = req.params.testId;
    const userId = req.user._id; // Assuming you have middleware that attaches the user to the request
    const result = await Result.findOne({ test: testId, user: userId });
    
    if (result) {
      return res.json({ allowed: false, message: 'You have already attempted this test. The number of attempts allowed is only one.' });
    } else {
      return res.json({ allowed: true });
    }
  } catch (error) {
    console.error('Error checking test start:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};




// Submit test results
module.exports.submitTestResults = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const userId = req.user._id;
    
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid input data.' });
    }
    const test = await Test.findById(testId).populate('questions');

    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    
    let correct = 0;
    let incorrect = 0;
    let notAttempted = 0;
    test.questions.forEach((question) => {
      
      const userAnswer = answers.find((answer) => answer.questionId === question._id.toString());
      
      if (!userAnswer || !userAnswer.optionId) {
        notAttempted++;
        return;
      }

      const correctOption = question.options.find(option => option.isCorrect);
      if (userAnswer.optionId === correctOption._id.toString()) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const result = new Result({
      user: userId,
      test: testId,
      correct,
      incorrect,
      notAttempted,
      total: correct + incorrect + notAttempted
    });
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error submitting test results:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch a specific result
module.exports.getResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const result = await Result.findOne({ test: testId, user: req.user._id }).populate('test', 'title subject');
    if (!result) {
      return res.status(404).json({ message: 'Result not found.' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch results for the logged-in user
module.exports.getUserResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await Result.find({ user: userId }).populate('test', 'title subject');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching user results:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};