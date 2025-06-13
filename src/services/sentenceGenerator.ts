import { Difficulty, ThaiSentence } from '../types';

// Temporary sample sentences until we implement GPT integration
const SAMPLE_SENTENCES: Record<Difficulty, ThaiSentence[]> = {
  beginner: [
    {
      thai: ['สวัสดี', 'ครับ', 'คุณ'],
      english: 'Hello, you',
      hints: ['Start with a greeting']
    },
    {
      thai: ['ผม', 'ชื่อ', 'สมชาย'],
      english: 'My name is Somchai',
      hints: ['Introducing yourself']
    },
    {
      thai: ['คุณ', 'สบาย', 'ดี', 'ไหม'],
      english: 'How are you?',
      hints: ['Asking about well-being']
    }
  ],
  intermediate: [
    {
      thai: ['วันนี้', 'ผม', 'ไป', 'โรงเรียน', 'ด้วย', 'รถ', 'เมล์'],
      english: 'Today I go to school by bus',
      hints: ['Using transportation']
    },
    {
      thai: ['คุณ', 'ชอบ', 'กิน', 'อาหาร', 'ไทย', 'ไหม'],
      english: 'Do you like Thai food?',
      hints: ['Asking about preferences']
    }
  ],
  advanced: [
    {
      thai: ['เมื่อวาน', 'ผม', 'ได้', 'ไป', 'เที่ยว', 'ที่', 'เกาะ', 'พีพี'],
      english: 'Yesterday I went to visit Phi Phi Island',
      hints: ['Past tense travel']
    },
    {
      thai: ['ถ้า', 'ฝน', 'ตก', 'ผม', 'จะ', 'อยู่', 'บ้าน', 'ทั้งวัน'],
      english: 'If it rains, I will stay at home all day',
      hints: ['Conditional sentence']
    }
  ]
};

export const generateSentence = (difficulty: Difficulty): ThaiSentence => {
  const sentences = SAMPLE_SENTENCES[difficulty];
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
};

// TODO: Implement GPT integration
export const generateSentenceWithGPT = async (difficulty: Difficulty): Promise<ThaiSentence> => {
  // This will be implemented later with GPT API
  return generateSentence(difficulty);
}; 