import { sentences } from '../data/sentences';
import { ThaiSentence } from '../types';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type CategoryKey = 'simple_sentences' | 'intermediate_sentences' | 'advanced_sentences';

const difficultyMap: Record<DifficultyLevel, CategoryKey> = {
  'beginner': 'simple_sentences',
  'intermediate': 'intermediate_sentences',
  'advanced': 'advanced_sentences'
};

export const generateSentence = (difficulty: DifficultyLevel): ThaiSentence => {
  const allSentences: ThaiSentence[] = [];
  const targetCategory = difficultyMap[difficulty];
  const categorySentences = sentences[targetCategory].sentences;

  // Add all sentences from the matching difficulty category
  categorySentences.forEach((sentence: ThaiSentence) => {
    allSentences.push(sentence);
  });

  if (allSentences.length === 0) {
    throw new Error(`No sentences found for difficulty level: ${difficulty}`);
  }

  // Randomly select a sentence from the filtered list
  const randomIndex = Math.floor(Math.random() * allSentences.length);
  return allSentences[randomIndex];
};

// TODO: Implement GPT integration
export const generateSentenceWithGPT = async (difficulty: DifficultyLevel): Promise<ThaiSentence> => {
  // This will be implemented later with GPT API
  return generateSentence(difficulty);
}; 