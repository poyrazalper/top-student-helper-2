import { BookOpenIcon, CalculatorIcon, PencilSquareIcon, BeakerIcon, LightBulbIcon } from './components/icons';
import { TopicInfo, TopicCategory, Task, UserProfile, TestResult, FlashcardResult } from './types';

const englishTopics: TopicInfo[] = [
  {
    name: 'Craft and Structure',
    description: 'Analyze word choice, text structure, point of view, purpose, and arguments.',
    icon: LightBulbIcon,
    subTopics: [{ name: 'Word Choice & Rhetoric' }, { name: 'Text Structure & Purpose' }, { name: 'Point of View' }],
  },
  {
    name: 'Information and Ideas',
    description: 'Understand central ideas, summarize texts, and analyze relationships between texts.',
    icon: BookOpenIcon,
    subTopics: [{ name: 'Central Ideas & Details' }, { name: 'Command of Evidence' }, { name: 'Inferences' }],
  },
   {
    name: 'Standard English Conventions',
    description: 'Master sentence structure, grammar, and punctuation.',
    icon: PencilSquareIcon,
    subTopics: [{ name: 'Sentence Boundaries' }, { name: 'Punctuation' }, { name: 'Verb & Noun Forms' }],
  },
  {
    name: 'Expression of Ideas',
    description: 'Improve the effectiveness of language and rhetorical organization.',
    icon: PencilSquareIcon,
    subTopics: [{ name: 'Rhetorical Synthesis' }, { name: 'Transitions' }],
  },
];

const mathTopics: TopicInfo[] = [
  {
    name: 'Heart of Algebra',
    description: 'Master linear equations, inequalities, and functions.',
    icon: CalculatorIcon,
    subTopics: [{ name: 'Linear Equations' }, { name: 'Systems of Equations' }, { name: 'Linear Inequalities' }],
  },
  {
    name: 'Problem Solving and Data Analysis',
    description: 'Work with ratios, percentages, and interpret data from graphs and tables.',
    icon: BeakerIcon,
    subTopics: [{ name: 'Ratios, Rates & Proportions' }, { name: 'Percentages' }, { name: 'Data Interpretation (Graphs & Tables)' }],
  },
  {
    name: 'Passport to Advanced Math',
    description: 'Handle complex equations, including quadratics and polynomials.',
    icon: CalculatorIcon,
    subTopics: [{ name: 'Quadratic Functions' }, { name: 'Polynomials' }, { name: 'Exponents & Radicals' }],
  },
  {
    name: 'Geometry and Trigonometry',
    description: 'Solve problems involving shapes, angles, triangles, and trigonometric functions.',
    icon: CalculatorIcon,
    subTopics: [{ name: 'Area & Volume' }, { name: 'Lines, Angles & Triangles' }, { name: 'Circles' }, { name: 'Basic Trigonometry' }],
  },
];

export const SAT_TOPIC_CATEGORIES: TopicCategory[] = [
  {
    categoryName: 'English',
    icon: BookOpenIcon,
    topics: englishTopics,
  },
  {
    categoryName: 'Math',
    icon: CalculatorIcon,
    topics: mathTopics,
  },
];

export const ALL_SAT_TOPICS: TopicInfo[] = [...englishTopics, ...mathTopics];

export const MOCK_TEST_QUESTIONS_COUNT = 10;
export const PLACEMENT_QUIZ_QUESTIONS_COUNT = 10;

export const TASKS: Task[] = [
  { id: 'first_sim', description: 'Complete your first Full Simulation test', xp: 250, isCompleted: (p, th) => th.some(t => t.testType === 'Full Simulation') },
  { id: 'score_1200', description: 'Score 1200 or higher on a Full Simulation', xp: 500, isCompleted: (p, th) => th.some(t => t.testType === 'Full Simulation' && t.totalScore >= 1200) },
  { id: 'score_1400', description: 'Score 1400 or higher on a Full Simulation', xp: 1000, isCompleted: (p, th) => th.some(t => t.testType === 'Full Simulation' && t.totalScore >= 1400) },
  { id: 'five_flash_decks', description: 'Complete 5 flashcard decks', xp: 150, isCompleted: (p, th, fh) => fh.length >= 5 },
  { id: 'ten_quick_tests', description: 'Complete 10 Quick Tests', xp: 300, isCompleted: (p, th) => th.filter(t => t.testType === 'Quick').length >= 10 },
  { id: 'perfect_flash_deck', description: 'Get a perfect score on a flashcard deck', xp: 200, isCompleted: (p, th, fh) => fh.some(f => f.score === f.total) },
];