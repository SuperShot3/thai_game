import { Difficulty, ThaiSentence } from '../types';

// Temporary sample sentences until we implement GPT integration
const SAMPLE_SENTENCES: Record<Difficulty, ThaiSentence[]> = {
  beginner: [
    {
      thai: ['สวัสดี', 'ครับ'],
      english: 'Hello',
      hints: ['Start with a polite greeting']
    },
    {
      thai: ['ผม', 'ชื่อ', 'สมชาย'],
      english: 'My name is Somchai',
      hints: ['Introducing yourself']
    },
    {
      thai: ['คุณ', 'ชื่อ', 'อะไร'],
      english: 'What is your name?',
      hints: ['Asking for someone\'s name']
    },
    {
      thai: ['คุณ', 'มาจาก', 'ประเทศ', 'อะไร'],
      english: 'Which country are you from?',
      hints: ['Asking someone\'s origin']
    },
    {
      thai: ['ฉัน', 'หิว', 'ข้าว'],
      english: 'I am hungry',
      hints: ['Talking about hunger']
    },
    {
      thai: ['คุณ', 'สบายดี', 'ไหม'],
      english: 'How are you?',
      hints: ['Checking well-being']
    }
  ],

  intermediate: [
    {
      thai: ['วันนี้', 'ผม', 'จะ', 'ไป', 'โรงเรียน', 'ด้วย', 'รถ', 'เมล์'],
      english: 'Today I will go to school by bus',
      hints: ['Talking about future plans']
    },
    {
      thai: ['คุณ', 'ชอบ', 'กิน', 'อาหาร', 'ไทย', 'ไหม'],
      english: 'Do you like Thai food?',
      hints: ['Asking about preferences']
    },
    {
      thai: ['ผม', 'กำลัง', 'เรียน', 'ภาษา', 'ไทย'],
      english: 'I am learning Thai',
      hints: ['Talking about current activity']
    },
    {
      thai: ['ตอนเช้า', 'ผม', 'ชอบ', 'ดื่ม', 'กาแฟ'],
      english: 'In the morning, I like to drink coffee',
      hints: ['Describing daily routine']
    },
    {
      thai: ['คุณ', 'เคย', 'ไป', 'เชียงใหม่', 'ไหม'],
      english: 'Have you ever been to Chiang Mai?',
      hints: ['Asking about past experience']
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
      english: 'If it rains, I will stay home all day',
      hints: ['Conditional sentence']
    },
    {
      thai: ['ถึงแม้ว่า', 'ผม', 'จะ', 'เหนื่อย', 'แต่', 'ผม', 'ก็', 'ไป', 'ทำงาน'],
      english: 'Even though I was tired, I still went to work',
      hints: ['Concession structure']
    },
    {
      thai: ['ผม', 'คิดว่า', 'การเรียน', 'ภาษา', 'ใหม่', 'เป็น', 'เรื่อง', 'ท้าทาย'],
      english: 'I think learning a new language is challenging',
      hints: ['Expressing opinion']
    },
    {
      thai: ['ผม', 'อยาก', 'ให้', 'คุณ', 'ช่วย', 'อธิบาย', 'คำนี้', 'อีกครั้ง'],
      english: 'I want you to explain this word again',
      hints: ['Requesting clarification']
    }
  ]
};

export const generateSentence = (difficulty: Difficulty, currentSentence?: ThaiSentence): ThaiSentence => {
  const sentences = SAMPLE_SENTENCES[difficulty];
  
  // If there's only one sentence in the difficulty level, return it
  if (sentences.length === 1) {
    return sentences[0];
  }

  // If we have a current sentence, find a different one
  if (currentSentence) {
    const availableSentences = sentences.filter(s => 
      s.thai.join('') !== currentSentence.thai.join('')
    );
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    return availableSentences[randomIndex];
  }

  // If no current sentence, return a random one
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
};

// TODO: Implement GPT integration
export const generateSentenceWithGPT = async (difficulty: Difficulty): Promise<ThaiSentence> => {
  // This will be implemented later with GPT API
  return generateSentence(difficulty);
}; 