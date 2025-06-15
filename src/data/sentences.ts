import { Difficulty } from '../types';

interface SentenceData {
  [key: string]: {
    description: string;
    sentences: {
      thai: string[];
      thaiWords: string[];
      english: string;
      hints: string[];
      difficulty: Difficulty;
    }[];
  };
}

export const sentences: SentenceData = {
  "simple_sentences": {
    "description": "Basic Thai sentences for beginners",
    "sentences": [
      {
        "thai": ["ฉัน", "ชื่อ", "แอน"],
        "thaiWords": ["ฉัน", "ชื่อ", "แอน"],
        "english": "My name is Ann",
        "hints": ["I", "name", "Ann"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "สบายดี", "ไหม"],
        "thaiWords": ["คุณ", "สบายดี", "ไหม"],
        "english": "How are you?",
        "hints": ["you", "well", "question"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ขอบคุณ", "มาก", "ค่ะ"],
        "thaiWords": ["ขอบคุณ", "มาก", "ค่ะ"],
        "english": "Thank you very much (female)",
        "hints": ["thank", "very", "female"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ไม่", "เข้าใจ"],
        "thaiWords": ["ฉัน", "ไม่", "เข้าใจ"],
        "english": "I don't understand",
        "hints": ["I", "not", "understand"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ยินดี", "ที่", "ได้รู้จัก"],
        "thaiWords": ["ยินดี", "ที่", "ได้รู้จัก"],
        "english": "Nice to meet you",
        "hints": ["glad", "to", "meet"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ไม่", "เข้าใจ"],
        "thaiWords": ["ฉัน", "ไม่", "เข้าใจ"],
        "english": "I don't understand",
        "hints": ["I", "not", "understand"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "เข้าใจ", "แล้ว"],
        "thaiWords": ["ฉัน", "เข้าใจ", "แล้ว"],
        "english": "I understand now",
        "hints": ["I", "understand", "already"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ไม่", "รู้"],
        "thaiWords": ["ฉัน", "ไม่", "รู้"],
        "english": "I don't know",
        "hints": ["I", "not", "know"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ห้องน้ำ", "อยู่", "ที่ไหน"],
        "thaiWords": ["ห้องน้ำ", "อยู่", "ที่ไหน"],
        "english": "Where is the bathroom?",
        "hints": ["bathroom", "is", "where"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "สบายดี", "ไหม"],
        "thaiWords": ["คุณ", "สบายดี", "ไหม"],
        "english": "How are you?",
        "hints": ["you", "well", "question"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ชื่อ", "เคน"],
        "thaiWords": ["ฉัน", "ชื่อ", "เคน"],
        "english": "My name is Ken",
        "hints": ["I", "name", "Ken"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "ชื่อ", "อะไร"],
        "thaiWords": ["คุณ", "ชื่อ", "อะไร"],
        "english": "What is your name?",
        "hints": ["you", "name", "what"],
        "difficulty": "beginner"
      }
    ]
  },
  "intermediate_sentences": {
    "description": "Intermediate Thai sentences",
    "sentences": [
      {
        "thai": ["ยินดี", "ที่", "ได้รู้จัก"],
        "thaiWords": ["ยินดี", "ที่", "ได้รู้จัก"],
        "english": "Nice to meet you",
        "hints": ["pleased", "to", "know you"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ช่วย", "พูด", "ช้าๆ"],
        "thaiWords": ["ช่วย", "พูด", "ช้าๆ"],
        "english": "Please speak slowly",
        "hints": ["help", "speak", "slowly"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "หิว", "ข้าว"],
        "thaiWords": ["ฉัน", "หิว", "ข้าว"],
        "english": "I'm hungry (for rice/food)",
        "hints": ["I", "hungry", "rice"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["นั่น", "คือ", "อะไร"],
        "thaiWords": ["นั่น", "คือ", "อะไร"],
        "english": "What is that?",
        "hints": ["that", "is", "what"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "พูด", "ไทย", "ได้นิดหน่อย"],
        "thaiWords": ["ฉัน", "พูด", "ไทย", "ได้นิดหน่อย"],
        "english": "I can speak a little Thai",
        "hints": ["I", "speak", "Thai", "a little"],
        "difficulty": "intermediate"
      }
    ]
  },
  "advanced_sentences": {
    "description": "Advanced Thai sentences",
    "sentences": [
      {
        "thai": ["ขนม", "กะทิ", "หวาน", "มาก"],
        "thaiWords": ["ขนม", "กะทิ", "หวาน", "มาก"],
        "english": "The dessert with coconut milk is very sweet",
        "hints": ["dessert", "coconut milk", "sweet", "very"],
        "difficulty": "advanced"
      },
      {
        "thai": ["เศษ", "ขนม", "ใน", "จาน"],
        "thaiWords": ["เศษ", "ขนม", "ใน", "จาน"],
        "english": "Dessert scraps on the plate",
        "hints": ["scraps", "dessert", "plate"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ขนม", "เละ", "เพราะ", "กะทิ", "มาก"],
        "thaiWords": ["ขนม", "เละ", "เพราะ", "กะทิ", "มาก"],
        "english": "The dessert is mushy because there is too much coconut milk",
        "hints": ["dessert", "mushy", "coconut milk", "too much"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ผม", "ชอบ", "กิน", "ข้าว"],
        "thaiWords": ["ผม", "ชอบ", "กิน", "ข้าว"],
        "english": "I like to eat rice",
        "hints": ["I (male)", "to like", "to eat", "rice"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ฉัน", "ไม่", "ดู", "หนัง"],
        "thaiWords": ["ฉัน", "ไม่", "ดู", "หนัง"],
        "english": "I don't watch movies",
        "hints": ["I (female)", "not", "watch", "movie"],
        "difficulty": "advanced"
      }
    ]
  }
}; 