import { Difficulty, ThaiSentence } from '../types';

interface SentenceCollection {
  id: string;
  name: string;
  description: string;
  sentences: ThaiSentence[];
}

interface SentenceDatabase {
  collections: {
    [key: string]: SentenceCollection;
  };
}

export const sentences: SentenceDatabase = {
  "collections": {
    "basic_greetings": {
      "id": "basic_greetings",
      "name": "Basic Greetings",
      "description": "Common Thai greetings and basic expressions",
      "sentences": [
        {
          "thai": ["สวัสดี"],
          "english": "Hello",
          "hints": ["greeting"],
          "difficulty": "easy"
        },
        {
          "thai": ["ขอบคุณ"],
          "english": "Thank you",
          "hints": ["gratitude"],
          "difficulty": "easy"
        },
        {
          "thai": ["ชัด", "เจน"],
          "english": "Clearly",
          "hints": ["clear"],
          "difficulty": "easy"
        },
        {
          "thai": ["เพิ่ง", "ได้ยิน"],
          "english": "I just heard",
          "hints": ["just", "heard"],
          "difficulty": "beginner"
        }
      ]
    },
    "food_and_drinks": {
      "id": "food_and_drinks",
      "name": "Food and Drinks",
      "description": "Common Thai food and drink vocabulary",
      "sentences": [
        {
          "thai": ["ขนม", "กะทิ", "หวาน", "มาก"],
          "english": "The dessert with coconut milk is very sweet",
          "hints": ["dessert", "coconut milk", "sweet", "very"],
          "difficulty": "intermediate"
        },
        {
          "thai": ["เศษ", "ขนม", "ใน", "จาน"],
          "english": "Dessert scraps on the plate",
          "hints": ["scraps", "dessert", "plate"],
          "difficulty": "beginner"
        },
        {
          "thai": ["ขนม", "เละ", "เพราะ", "กะทิ", "มาก"],
          "english": "The dessert is mushy because there is too much coconut milk",
          "hints": ["dessert", "mushy", "coconut milk", "too much"],
          "difficulty": "intermediate"
        }
      ]
    },
    "daily_conversation": {
      "id": "daily_conversation",
      "name": "Daily Conversation",
      "description": "Common phrases used in daily life",
      "sentences": [
        {
          "thai": ["ผม", "ชอบ", "กิน", "ข้าว"],
          "english": "I like to eat rice",
          "hints": ["I (male)", "to like", "to eat", "rice"],
          "difficulty": "intermediate"
        },
        {
          "thai": ["ฉัน", "ไม่", "ดู", "หนัง"],
          "english": "I don't watch movies",
          "hints": ["I (female)", "not", "watch", "movie"],
          "difficulty": "intermediate"
        },
        {
          "thai": ["กล้า"],
          "english": "Dare",
          "hints": ["dare"],
          "difficulty": "easy"
        },
        {
          "thai": ["พูด", "ความจริง"],
          "english": "Speak the truth",
          "hints": ["speak", "truth"],
          "difficulty": "beginner"
        },
        {
          "thai": ["กระเป๋าเป้", "ใหม่"],
          "english": "New backpack",
          "hints": ["backpack", "new"],
          "difficulty": "beginner"
        },
        {
          "thai": ["เลือก", "หน้าที่", "ใหม่"],
          "english": "Choose a new duty",
          "hints": ["choose", "duty", "new"],
          "difficulty": "intermediate"
        }
      ]
    },
    "complex_sentences": {
      "id": "complex_sentences",
      "name": "Complex Sentences",
      "description": "More complex Thai sentences",
      "sentences": [
        {
          "thai": ["เศษ", "ขยะ", "ตัน", "ใน", "ท่อ"],
          "english": "Scraps clog the pipe",
          "hints": ["scraps", "clog", "pipe"],
          "difficulty": "advanced"
        },
        {
          "thai": ["เศษ", "อาหาร", "ทำให้", "ท่อ", "ตัน"],
          "english": "Food scraps make the pipe clogged",
          "hints": ["food scraps", "make", "pipe", "clogged"],
          "difficulty": "advanced"
        },
        {
          "thai": ["น้ำ", "ขุ่น", "ไหล", "ใน", "ท่อ", "ตลอด"],
          "english": "Murky water flows in the pipe all the time",
          "hints": ["water", "murky", "flow", "pipe", "all the time"],
          "difficulty": "advanced"
        },
        {
          "thai": ["เขา", "เป็น", "ผู้จัดการ", "ธรรมดา"],
          "english": "He is an ordinary manager",
          "hints": ["he", "manager", "ordinary"],
          "difficulty": "advanced"
        },
        {
          "thai": ["วิว", "จาก", "หน้าต่าง", "สวย", "มาก"],
          "english": "The view from the window is very beautiful",
          "hints": ["view", "window", "very beautiful"],
          "difficulty": "advanced"
        }
      ]
    }
  }
}; 