import { GoogleGenAI, Type } from "@google/genai";
import { Question, StructuredLesson, IncorrectQuestion, Flashcard } from "../types";
import { PLACEMENT_QUIZ_QUESTIONS_COUNT, MOCK_TEST_QUESTIONS_COUNT } from "../constants";

// Do not change this. The user's API key is injected automatically.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING },
        subTopic: { type: Type.STRING },
        category: { type: Type.STRING, enum: ['Math', 'English']},
        passage: { type: Type.STRING },
    },
    required: ['question', 'options', 'correctAnswer', 'explanation', 'topic', 'category']
};

const structuredLessonSchema = {
    type: Type.OBJECT,
    properties: {
        introduction: { type: Type.STRING },
        keyConcepts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                },
                required: ['title', 'content'],
            }
        },
        workedExample: {
            type: Type.OBJECT,
            properties: {
                problem: { type: Type.STRING },
                solution: { type: Type.STRING },
            },
            required: ['problem', 'solution'],
        },
        commonMistakes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    mistake: { type: Type.STRING },
                    correction: { type: Type.STRING },
                },
                required: ['mistake', 'correction'],
            }
        },
        conceptCheckQuestion: questionSchema,
    },
    required: ['introduction', 'keyConcepts', 'workedExample', 'commonMistakes', 'conceptCheckQuestion']
};

const flashcardGenSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        definition: { type: Type.STRING },
        sentence: { type: Type.STRING },
        distractors: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['word', 'definition', 'sentence', 'distractors']
};

const parseJsonResponse = <T>(jsonString: string): T => {
    try {
        const cleanedJsonString = jsonString.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedJsonString) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString);
        throw new Error("Invalid JSON response from API.");
    }
};

const basePromptSuffix = "For each question, provide 4 multiple-choice options, the correct answer, and a brief explanation. Ensure the correct answer is one of the options. For any reading comprehension questions that refer to a passage, you MUST provide the full passage text in the 'passage' field.";

export const generateSatQuestionBatch = async (topic: string, count: number): Promise<Question[]> => {
    const prompt = `Generate ${count} SAT-style practice questions on the topic of "${topic}". Provide a variety of difficulties. ${basePromptSuffix}`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: questionSchema
            },
        },
    });

    return parseJsonResponse<Question[]>(response.text);
};


export const getMistakeFeedback = async (question: Question, userAnswer: string): Promise<string> => {
    const prompt = `
        A student answered an SAT question incorrectly. Provide constructive feedback on why their answer might be wrong and suggest a concept to review. Keep the feedback concise and encouraging.
        Question: "${question.question}"
        Options: ${question.options.join(', ')}
        Correct Answer: "${question.correctAnswer}"
        Student's incorrect answer: "${userAnswer}"
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });

    return response.text;
};

export const generateQuickPracticeQuiz = async (count: number, subject: 'Math' | 'English' | 'Mixed', difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Question[]> => {
    const subjectPrompt = subject === 'Mixed' ? 'Math and English' : subject;
    const prompt = `Generate a quick practice quiz of ${count} SAT-style questions. The questions should be from the ${subjectPrompt} section(s) and have a ${difficulty} difficulty level. ${basePromptSuffix}`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: questionSchema
            },
        },
    });

    return parseJsonResponse<Question[]>(response.text);
};

export const generateMockTest = async (): Promise<Question[]> => {
    const prompt = `Generate a ${MOCK_TEST_QUESTIONS_COUNT}-question mixed SAT practice test. Distribute the questions as evenly as possible across all major Math and English topics. Ensure a range of difficulties. ${basePromptSuffix}`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: questionSchema
            },
        },
    });

    return parseJsonResponse<Question[]>(response.text);
};

export const generateAdaptiveSatModule = async (section: 'English' | 'Math', difficulty: 'easy' | 'medium' | 'hard', count: number): Promise<Question[]> => {
    const prompt = `Generate an adaptive SAT module with ${count} questions for the ${section} section. Distribute the questions as evenly as possible across all topics within the ${section} category. The difficulty should be targeted at a ${difficulty} level. ${basePromptSuffix}`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: questionSchema
            },
        },
    });

    return parseJsonResponse<Question[]>(response.text);
};


export const generatePlacementQuiz = async (): Promise<Question[]> => {
    const prompt = `Generate a ${PLACEMENT_QUIZ_QUESTIONS_COUNT}-question SAT placement quiz. It should contain a mix of core Math and English concepts with varying difficulty to gauge a user's starting level. ${basePromptSuffix}`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: questionSchema
            },
        },
    });

    return parseJsonResponse<Question[]>(response.text);
};

export const generateStructuredTopicLesson = async (mainTopic: string, subTopic: string): Promise<StructuredLesson> => {
    const prompt = `Create a structured lesson plan for an SAT prep student on the topic "${subTopic}" which is part of the broader category "${mainTopic}". The lesson should be highly example-driven and minimize long paragraphs of text. Focus on showing concepts through clear, step-by-step examples. It should include: 
1. A brief introduction to the concept.
2. Key concepts, each explained with a simple definition and a clear example.
3. A detailed, step-by-step worked example of a typical SAT problem for this topic.
4. Common mistakes, each illustrated with a "what not to do" example and a corrected version showing the right approach.
5. One concept check question with 4 options and a detailed explanation. For the concept check question, if it's a reading comprehension question, you MUST include a passage.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: structuredLessonSchema
        },
    });

    return parseJsonResponse<StructuredLesson>(response.text);
};

export const regenerateMistakeQuestions = async (mistakes: IncorrectQuestion[]): Promise<Question[]> => {
    const mistakeSummary = mistakes.map(m => `Topic: ${m.question.topic}, Question: "${m.question.question}"`).join('\n');
    const prompt = `A student made the following mistakes:\n${mistakeSummary}\n\nGenerate ${mistakes.length} new, unique SAT-style questions that test the same underlying concepts as the questions the student got wrong. Do not repeat the original questions. ${basePromptSuffix}`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: questionSchema
            },
        },
    });

    return parseJsonResponse<Question[]>(response.text);
};

export const generateFlashcards = async (count: number): Promise<Flashcard[]> => {
    const prompt = `Generate ${count} SAT vocabulary flashcards. For each flashcard, provide a challenging word, its correct definition, an example sentence, and three incorrect but plausible definitions to be used as distractors in a multiple-choice quiz.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: flashcardGenSchema
            },
        },
    });
    
    const parsedData = parseJsonResponse<{word: string, definition: string, sentence: string, distractors: string[]}[]>(response.text);
    
    const shuffle = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    
    return parsedData.map(item => ({
        word: item.word,
        definition: item.definition,
        sentence: item.sentence,
        options: shuffle([...item.distractors, item.definition])
    }));
};