import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = 3000;

// Shared Gemini AI client helper
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MATH_DETECTIVE_SYSTEM_INSTRUCTION = `You are MathDetective AI, an expert mathematics tutor and solution-error analyst.

Your job is not merely to solve mathematics problems. Your primary responsibility is to analyze a student's attempted solution and help them understand where and why their reasoning went wrong.

When analyzing a student's solution:
1. Read the original problem carefully.
2. Read the student's complete attempted solution.
3. Break the solution into logical steps.
4. Check each step mathematically.
5. Identify the FIRST significant incorrect step.
6. Do not incorrectly mark a valid alternative method as wrong.
7. Explain the mathematical reason for the error.
8. Identify the underlying concept or misconception.
9. Give a helpful hint rather than immediately revealing the complete solution.
10. Encourage the student to correct the mistake themselves.
11. Adapt explanations to the student's education level (School, College, or Undergraduate) and selected difficulty.
12. Be patient, respectful, and encouraging. Never shame or criticize the student.
13. If the student's solution is correct, clearly explain why it is correct and congratulate their reasoning.
14. If the problem or solution is unclear, ask for clarification politely.
15. Never invent mathematical facts. Verify calculations carefully.

When LaTeX math notation is used, wrap formulas in standard $...$ for inline or $$...$$ for block math.
Your goal is to help students become independent mathematical problem solvers.`;

// API Routes

// 1. Main Solution Error Investigation Route
app.post('/api/investigate', async (req, res) => {
  try {
    const { problem, solution, topic, educationLevel, difficulty } = req.body;

    if (!problem || typeof problem !== 'string' || !problem.trim()) {
      return res.status(400).json({ error: 'Please provide a valid mathematics problem.' });
    }
    if (!solution || typeof solution !== 'string' || !solution.trim()) {
      return res.status(400).json({ error: 'Please provide the student attempted solution.' });
    }

    const ai = getGeminiAI();

    const prompt = `Analyze this student solution like a mathematical detective:

Problem Statement:
${problem}

Student's Attempted Solution:
${solution}

Context:
Topic: ${topic || 'Auto Detect Topic'}
Education Level: ${educationLevel || 'School'}
Difficulty Level: ${difficulty || 'Intermediate'}

Perform a thorough step-by-step analysis. Locate the FIRST mistake if any exists. Provide progressive hints (level 1, 2, 3), explain the misconception, give a next step, and provide a full clean solution for reference.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: MATH_DETECTIVE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSolutionCorrect: { type: Type.BOOLEAN },
            detectedTopic: { type: Type.STRING },
            caseSummary: {
              type: Type.OBJECT,
              properties: {
                problemStatement: { type: Type.STRING },
                studentApproachSummary: { type: Type.STRING },
              },
              required: ['problemStatement', 'studentApproachSummary'],
            },
            stepsBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  content: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  explanation: { type: Type.STRING },
                },
                required: ['stepNumber', 'content', 'isCorrect'],
              },
            },
            mistakeDetails: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                incorrectStepContent: { type: Type.STRING },
                whatWentWrong: { type: Type.STRING },
                misconceptionReason: { type: Type.STRING },
              },
            },
            hints: {
              type: Type.OBJECT,
              properties: {
                level1: { type: Type.STRING, description: 'Small conceptual hint' },
                level2: { type: Type.STRING, description: 'More specific hint' },
                level3: { type: Type.STRING, description: 'Strong hint almost guiding to fix' },
              },
              required: ['level1', 'level2', 'level3'],
            },
            conceptToReview: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['title', 'explanation'],
            },
            tryAgainNextStep: { type: Type.STRING },
            fullStepByStepSolution: { type: Type.STRING },
            encouragingClosing: { type: Type.STRING },
          },
          required: [
            'isSolutionCorrect',
            'detectedTopic',
            'caseSummary',
            'stepsBreakdown',
            'hints',
            'conceptToReview',
            'tryAgainNextStep',
            'fullStepByStepSolution',
            'encouragingClosing',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received empty response from Gemini API.');
    }

    const result = JSON.parse(text);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/investigate:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze mathematical solution. Please check your API key or input.',
    });
  }
});

// 2. Generate Similar Problem Route (Feature 3: Similar Case)
app.post('/api/similar-problem', async (req, res) => {
  try {
    const { originalProblem, conceptTitle, topic, educationLevel } = req.body;

    if (!originalProblem) {
      return res.status(400).json({ error: 'Original problem is required.' });
    }

    const ai = getGeminiAI();

    const prompt = `Generate a new mathematics problem that tests the SAME mathematical concept as this original problem, but uses different numbers or context.

Original Problem: ${originalProblem}
Concept to test: ${conceptTitle || 'Core mathematical procedure'}
Topic: ${topic || 'Algebra'}
Education Level: ${educationLevel || 'School'}

Return JSON containing:
1. originalConcept: short label of the concept
2. newProblem: the newly created problem
3. hintForNewProblem: a small hint to guide the student if stuck
4. expectedFinalAnswerSummary: brief string of the target answer for checking logic later`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: MATH_DETECTIVE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalConcept: { type: Type.STRING },
            newProblem: { type: Type.STRING },
            hintForNewProblem: { type: Type.STRING },
            expectedFinalAnswerSummary: { type: Type.STRING },
          },
          required: ['originalConcept', 'newProblem', 'hintForNewProblem'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI model.');
    const result = JSON.parse(text);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/similar-problem:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate similar problem.' });
  }
});

// 3. Check Student Solution to Similar Problem or Fix
app.post('/api/check-solution', async (req, res) => {
  try {
    const { problem, studentSolution, expectedConcept } = req.body;

    if (!problem || !studentSolution) {
      return res.status(400).json({ error: 'Problem and student solution are required.' });
    }

    const ai = getGeminiAI();

    const prompt = `Check this student's solution to determine if they have mastered the concept and corrected their previous misconception.

Problem:
${problem}

Concept Tested:
${expectedConcept || 'General mathematical accuracy'}

Student's Attempted Solution:
${studentSolution}

Evaluate if the solution is completely correct and if the student mastered the concept.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: MATH_DETECTIVE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            conceptMastered: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            firstMistakeIfAny: { type: Type.STRING },
            encouragement: { type: Type.STRING },
          },
          required: ['isCorrect', 'conceptMastered', 'feedback', 'encouragement'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI model.');
    const result = JSON.parse(text);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/check-solution:', err);
    return res.status(500).json({ error: err.message || 'Failed to verify solution.' });
  }
});

// 4. Teach Me Mode (Feature 4: Interactive Tutor Chat)
app.post('/api/teach-me', async (req, res) => {
  try {
    const { topic, problem, history, userMessage } = req.body;

    const ai = getGeminiAI();

    const chatHistoryText = Array.isArray(history)
      ? history.map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')
      : '';

    const prompt = `You are in "TEACH ME MODE".
Topic: ${topic || 'Mathematics'}
Problem/Goal: ${problem || 'Help the student understand a concept'}

Chat History so far:
${chatHistoryText}

Student's latest response:
"${userMessage || 'I want to start learning'}"

Your Role:
Act like a patient, enthusiastic mathematics tutor.
DO NOT immediately reveal the complete solution.
Guide the student step-by-step by asking clear, focused questions.
If the student makes a mistake, gently point out what part of their reasoning to reconsider.
Keep responses concise (2-4 paragraphs max) and finish with a guiding question for the student to answer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: MATH_DETECTIVE_SYSTEM_INSTRUCTION,
      },
    });

    return res.json({ response: response.text || "Let's explore this together! What is your first thought on this problem?" });
  } catch (err: any) {
    console.error('Error in /api/teach-me:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate tutor response.' });
  }
});

// 5. Practice Problem Generator
app.post('/api/generate-practice', async (req, res) => {
  try {
    const { topic, difficulty, educationLevel } = req.body;

    const ai = getGeminiAI();

    const prompt = `Generate a realistic math problem for practice.
Topic: ${topic || 'Algebra'}
Difficulty: ${difficulty || 'Intermediate'}
Level: ${educationLevel || 'School'}

Provide a clear problem, a hint, and the full step-by-step reference solution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: MATH_DETECTIVE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            problem: { type: Type.STRING },
            hint: { type: Type.STRING },
            solution: { type: Type.STRING },
          },
          required: ['title', 'problem', 'hint', 'solution'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI model.');
    const result = JSON.parse(text);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-practice:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate practice problem.' });
  }
});

// Vite Middleware for dev or static serving for prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MathDetective AI server running on http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
