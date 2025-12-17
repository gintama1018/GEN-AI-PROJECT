// Gemini API Client for GeminiMind

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question, UserAnswer, EvaluationResult, Persona } from '../types/appTypes';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
};

export const isGeminiInitialized = () => genAI !== null;

// Dynamic Learning Tool - Generate Questions from Document
export const generateQuestionsFromDocument = async (
    documentText: string
): Promise<Question[]> => {
    if (!genAI) throw new Error('Gemini not initialized');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert educator and assessment designer. Analyze the following document and create exactly 5 unique, complex questions that test deep understanding of the content.

DOCUMENT:
"""
${documentText}
"""

Create questions of varying types and difficulties:
1. One ANALYTICAL question (medium difficulty) - requires breaking down concepts
2. One INFERENTIAL question (hard difficulty) - requires drawing conclusions not explicitly stated
3. One EVALUATIVE question (hard difficulty) - requires judging or critiquing ideas
4. One APPLICATION question (expert difficulty) - requires applying concepts to new scenarios
5. One SYNTHESIS question (expert difficulty) - requires combining multiple concepts creatively

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "id": 1,
    "text": "Question text here",
    "type": "analytical",
    "difficulty": "medium"
  },
  ...
]

Make questions thought-provoking and require genuine understanding, not just memorization.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the JSON response
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const questions: Question[] = JSON.parse(cleanedResponse);

    return questions;
};

// Dynamic Learning Tool - Evaluate Answers
export const evaluateAnswers = async (
    documentText: string,
    questions: Question[],
    answers: UserAnswer[]
): Promise<EvaluationResult> => {
    if (!genAI) throw new Error('Gemini not initialized');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const questionsAndAnswers = questions.map((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        return {
            question: q.text,
            type: q.type,
            difficulty: q.difficulty,
            userAnswer: answer?.answer || 'No answer provided',
        };
    });

    const prompt = `You are an expert educator evaluating student answers. Given the source document and the student's answers to questions about it, provide comprehensive feedback.

SOURCE DOCUMENT:
"""
${documentText}
"""

QUESTIONS AND ANSWERS:
${JSON.stringify(questionsAndAnswers, null, 2)}

Evaluate each answer based on:
- Accuracy (based on the document)
- Depth of understanding
- Critical thinking demonstrated
- Use of evidence from the document

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "overallScore": 75,
  "summary": "Overall assessment of performance",
  "strengthAreas": ["Area 1", "Area 2"],
  "improvementAreas": ["Area 1", "Area 2"],
  "feedbacks": [
    {
      "questionId": 1,
      "score": 80,
      "isCorrect": true,
      "feedback": "Detailed feedback on this answer",
      "keyInsightsMissed": ["Insight 1"],
      "suggestedImprovement": "How to improve this answer"
    }
  ]
}

Be constructive, specific, and encouraging while being honest about areas for improvement.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const evaluation: EvaluationResult = JSON.parse(cleanedResponse);

    return evaluation;
};

// Content Generator - Generate with Persona
export const generateContentWithPersona = async (
    persona: Persona,
    contentType: string,
    userPrompt: string
): Promise<string> => {
    if (!genAI) throw new Error('Gemini not initialized');

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: persona.systemPrompt,
    });

    const prompt = `Generate ${contentType} content based on the following request:

REQUEST: ${userPrompt}

OUTPUT PREFERENCES:
- Length: ${persona.outputPreferences.length}
- Format: ${persona.outputPreferences.format}
- Style: ${persona.outputPreferences.style}

Provide high-quality content that matches these preferences and your persona's expertise. If generating code, include proper syntax and comments. If generating copy, make it compelling and actionable.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
};

// Validate API Key
// Validate API Key
export const validateApiKey = async (apiKey: string): Promise<boolean | string> => {
    try {
        const testAI = new GoogleGenerativeAI(apiKey);
        const model = testAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        await model.generateContent('Say "OK" if you can hear me.');
        return true;
    } catch (error: any) {
        console.error('API Key Validation Failed:', error);
        return error.message || 'Unknown validation error';
    }
};
