const express = require('express');
const authMiddleware = require('../middleware/auth');
const Question = require('../models/Question');
const axios = require('axios');
require('dotenv').config(); 
var request = require('request');

const router = express.Router();

router.post('/questions', authMiddleware, async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Get the questions array from the request body
      const questions = req.body;
  
      // Create an array to store the new question objects
      const newQuestions = [];
  
      // Iterate over each question object in the array
      for (const questionData of questions) {
        // Destructure the question details
        const { code, category, name, shortBody, lastModified, permissions, uri } = questionData;
  
        // Create a new question object
        const newQuestion = new Question({
          code,
          category,
          name,
          shortBody,
          lastModified,
          permissions,
          uri,
        });
  
        // Save the new question to the database
        await newQuestion.save();
  
        // Push the new question object to the array
        newQuestions.push(newQuestion);
      }
  
      res.status(201).json(newQuestions);
    } catch (error) {
      console.error('Add question error:', error);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });


  router.get('/questions/random', async (req, res) => {
  try {
    // Get the total number of questions in the database
    const totalQuestions = await Question.countDocuments();

    // Generate a random index within the range of totalQuestions
    const randomIndex = Math.floor(Math.random() * totalQuestions);

    // Fetch a random question from the database using the randomIndex
    const randomQuestion = await Question.findOne().skip(randomIndex);

    if (!randomQuestion) {
      return res.status(404).json({ error: 'No questions found' });
    }

    res.json(randomQuestion);
  } catch (error) {
    console.error('Fetch random question error:', error);
    res.status(500).json({ error: 'Failed to fetch random question' });
  }
});

  
  

  router.put('/questions/:questionId', authMiddleware, async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Get the question ID from the request parameters
      const { questionId } = req.params;
  
      // Get the updated question details from the request body
      const { code, category, name, shortBody, lastModified, permissions, uri } = req.body;
  
      // Find the question by ID and update its details
      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {
          code,
          category,
          name,
          shortBody,
          lastModified,
          permissions,
          uri,
        },
        { new: true }
      );
  
      if (!updatedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      res.json(updatedQuestion);
    } catch (error) {
      console.error('Edit question error:', error);
      res.status(500).json({ error: 'Failed to edit question' });
    }
  });
  
  
  router.delete('/questions/:questionId', authMiddleware, async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Get the question ID from the request parameters
      const { questionId } = req.params;
  
      // Find the question by ID and remove it
      const deletedQuestion = await Question.findByIdAndRemove(questionId);
  
      if (!deletedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Delete question error:', error);
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });
  

  router.post('/questions/:questionId/test-cases', authMiddleware, async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Get the question ID from the request parameters
      const { questionId } = req.params;
  
      // Find the question by ID
      const question = await Question.findById(questionId);
  
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      // Extract the test case details from the request body
      const { number, active } = req.body;
  
      // Add the new test case to the question's testCases array
      question.testcases.push({ number, active });
  
      // Save the updated question with the new test case
      await question.save();
  
      res.status(201).json(question);
    } catch (error) {
      console.error('Add test case error:', error);
      res.status(500).json({ error: 'Failed to add test case' });
    }
  });
  
  router.post('/questions/:questionId/solution', async (req, res) => {
    try {
      // Get the question ID from the request parameters
      const { questionId } = req.params;
  
      // Retrieve the question from the database
      const question = await Question.findById(questionId);
  
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      // Get the user's solution from the request body
      const { solution } = req.body;
  
      // Prepare the request payload for the Sphere Engine API
      const submissionData = {
        compilerId: process.env.SPHERE_ENGINE_COMPILER_ID,
        source: solution
      };
  
      // Send request to create a submission
      request.post({
        url: `${process.env.SPHERE_ENGINE_API_URL}/submissions?access_token=${process.env.SPHERE_ENGINE_API_KEY}`,
        form: submissionData
      }, async function (error, response, body) {
        if (error) {
          console.error('Solution check error:', error);
          return res.status(500).json({ error: 'Failed to check solution' });
        }
  
        // Process response
        if (response.statusCode === 201) {
          const submissionId = JSON.parse(body).id;
  
          // Check the result by querying the submission status
          const submissionUrl = `${process.env.SPHERE_ENGINE_API_URL}/submissions/${submissionId}?access_token=${process.env.SPHERE_ENGINE_API_KEY}`;
          
          // Set a timeout of 2 seconds
          setTimeout(() => {
            request.get(submissionUrl, async function (error, response, body) {
              if (error) {
                console.error('Solution check error:', error);
                return res.status(500).json({ error: 'Failed to check solution' });
              }
  
              // Parse the submission result
              const submissionResult = JSON.parse(body);
              console.log(submissionResult);
              const { result, streams } = submissionResult;
  
              let solutionStatus;
              if (result && result.status && result.status.name === 'accepted') {
                const output = streams.output ? streams.output.uri : '';
                if (output.trim() === question.testcases[0].output.trim()) {
                  solutionStatus = 'success';
                } else {
                  solutionStatus = 'wrong';
                }
              } else {
                solutionStatus = 'error';
              }
  
              res.json({ status: solutionStatus });
            });
          }, 5000); // 5-second timeout
        } else {
          console.error('Solution check error:', response.statusCode);
          res.status(response.statusCode).json({ error: 'Failed to create submission' });
        }
      });
    } catch (error) {
      console.error('Solution check error:', error);
      res.status(500).json({ error: 'Failed to check solution' });
    }
  });
  

  module.exports = router;

