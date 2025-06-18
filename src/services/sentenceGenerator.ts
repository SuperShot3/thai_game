import { Difficulty, ThaiSentence } from '../types';
import { sentences } from '../data/sentences';

const usedSentences: { [key in Difficulty]: Set<string> } = {
  beginner: new Set(),
  intermediate: new Set(),
  advanced: new Set()
};

export const generateSentence = (difficulty: Difficulty): ThaiSentence => {
  const categoryKey = difficulty === 'beginner' ? 'simple_sentences' :
    difficulty === 'intermediate' ? 'intermediate_sentences' : 'advanced_sentences';
  const categorySentences = sentences[categoryKey].sentences;

  // Filter out already used sentences
  const availableSentences = categorySentences.filter(
    (sentence: ThaiSentence) => !usedSentences[difficulty].has(sentence.english)
  );

  // If all sentences have been used, reset the used sentences for this difficulty
  if (availableSentences.length === 0) {
    usedSentences[difficulty].clear();
    return generateSentence(difficulty);
  }

  // Select a random sentence from available ones
  const selectedSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)];
  usedSentences[difficulty].add(selectedSentence.english);

  return selectedSentence;
};

// TODO: Implement GPT integration
export const generateSentenceWithGPT = async (difficulty: Difficulty): Promise<ThaiSentence> => {
  // This will be implemented later with GPT API
  return generateSentence(difficulty);
}; 