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
        "hints": ["First person pronoun (female)", "to be named", "name"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "สบายดี", "ไหม"],
        "thaiWords": ["คุณ", "สบายดี", "ไหม"],
        "english": "How are you?",
        "hints": ["Polite pronoun for 'you'", "to be well/healthy", "question particle"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ขอบคุณ", "มาก", "ค่ะ"],
        "thaiWords": ["ขอบคุณ", "มาก", "ค่ะ"],
        "english": "Thank you very much (female)",
        "hints": ["to thank", "very/many", "polite particle (female)"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ไม่", "เข้าใจ"],
        "thaiWords": ["ฉัน", "ไม่", "เข้าใจ"],
        "english": "I don't understand",
        "hints": ["First person pronoun (female)", "negative particle", "to understand"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ยินดี", "ที่", "ได้รู้จัก"],
        "thaiWords": ["ยินดี", "ที่", "ได้รู้จัก"],
        "english": "Nice to meet you",
        "hints": ["to be pleased", "relative pronoun", "to know/meet"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "เข้าใจ", "แล้ว"],
        "thaiWords": ["ฉัน", "เข้าใจ", "แล้ว"],
        "english": "I understand now",
        "hints": ["First person pronoun (female)", "to understand", "already/now"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ไม่", "รู้"],
        "thaiWords": ["ฉัน", "ไม่", "รู้"],
        "english": "I don't know",
        "hints": ["First person pronoun (female)", "negative particle", "to know"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ห้องน้ำ", "อยู่", "ที่ไหน"],
        "thaiWords": ["ห้องน้ำ", "อยู่", "ที่ไหน"],
        "english": "Where is the bathroom?",
        "hints": ["bathroom", "to be located", "where"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "ชื่อ", "อะไร"],
        "thaiWords": ["คุณ", "ชื่อ", "อะไร"],
        "english": "What is your name?",
        "hints": ["Polite pronoun for 'you'", "to be named", "what"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ชอบ", "กาแฟ"],
        "thaiWords": ["ฉัน", "ชอบ", "กาแฟ"],
        "english": "I like coffee",
        "hints": ["First person pronoun (female)", "to like", "coffee"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "ทำงาน", "ที่ไหน"],
        "thaiWords": ["คุณ", "ทำงาน", "ที่ไหน"],
        "english": "Where do you work?",
        "hints": ["Polite pronoun for 'you'", "to work", "where"],
        "difficulty": "beginner"
      },
      {
        "thai": ["วันนี้", "อากาศ", "ดี"],
        "thaiWords": ["วันนี้", "อากาศ", "ดี"],
        "english": "The weather is nice today",
        "hints": ["today", "weather", "good/nice"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ไป", "โรงเรียน"],
        "thaiWords": ["ฉัน", "ไป", "โรงเรียน"],
        "english": "I go to school",
        "hints": ["First person pronoun (female)", "to go", "school"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "รัก", "ประเทศไทย"],
        "thaiWords": ["ฉัน", "รัก", "ประเทศไทย"],
        "english": "I love Thailand",
        "hints": ["First person pronoun (female)", "to love", "Thailand"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ขอโทษ", "ครับ"],
        "thaiWords": ["ขอโทษ", "ครับ"],
        "english": "Sorry",
        "hints": ["to apologize", "polite particle (male)"],
        "difficulty": "beginner"
      },
      {
        "thai": ["ฉัน", "ต้องการ", "น้ำ"],
        "thaiWords": ["ฉัน", "ต้องการ", "น้ำ"],
        "english": "I need water",
        "hints": ["First person pronoun (female)", "to need/want", "water"],
        "difficulty": "beginner"
      },
      {
        "thai": ["คุณ", "พูด", "ภาษาอังกฤษ", "ได้ไหม"],
        "thaiWords": ["คุณ", "พูด", "ภาษาอังกฤษ", "ได้ไหม"],
        "english": "Can you speak English?",
        "hints": ["Polite pronoun for 'you'", "to speak", "English language", "can/able to (question)"],
        "difficulty": "beginner"
      }
    ]
  },
  "intermediate_sentences": {
    "description": "Intermediate Thai sentences",
    "sentences": [
      {
        "thai": ["ช่วย", "พูด", "ช้าๆ"],
        "thaiWords": ["ช่วย", "พูด", "ช้าๆ"],
        "english": "Please speak slowly",
        "hints": ["to help/please", "to speak", "slowly (reduplicated)"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "หิว", "ข้าว"],
        "thaiWords": ["ฉัน", "หิว", "ข้าว"],
        "english": "I'm hungry (for rice/food)",
        "hints": ["First person pronoun (female)", "to be hungry", "rice/food"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["นั่น", "คือ", "อะไร"],
        "thaiWords": ["นั่น", "คือ", "อะไร"],
        "english": "What is that?",
        "hints": ["that (far)", "to be", "what"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "พูด", "ไทย", "ได้นิดหน่อย"],
        "thaiWords": ["ฉัน", "พูด", "ไทย", "ได้นิดหน่อย"],
        "english": "I can speak a little Thai",
        "hints": ["First person pronoun (female)", "to speak", "Thai language", "a little bit"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "กำลัง", "อ่าน", "หนังสือ"],
        "thaiWords": ["ฉัน", "กำลัง", "อ่าน", "หนังสือ"],
        "english": "I am reading a book",
        "hints": ["First person pronoun (female)", "continuous marker", "to read", "book"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["พรุ่งนี้", "เราจะ", "ไป", "เที่ยว"],
        "thaiWords": ["พรุ่งนี้", "เราจะ", "ไป", "เที่ยว"],
        "english": "Tomorrow we will go travel",
        "hints": ["tomorrow", "we", "future marker", "to go", "to travel"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ราคา", "เท่าไร", "ต่อ", "กิโลกรัม"],
        "thaiWords": ["ราคา", "เท่าไร", "ต่อ", "กิโลกรัม"],
        "english": "How much is it per kilogram?",
        "hints": ["price", "how much", "per", "kilogram"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "จะ", "ไป", "โรงพยาบาล"],
        "thaiWords": ["ฉัน", "จะ", "ไป", "โรงพยาบาล"],
        "english": "I will go to the hospital",
        "hints": ["First person pronoun (female)", "future marker", "to go", "hospital"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["คุณ", "ชอบ", "กิน", "ผลไม้", "อะไร"],
        "thaiWords": ["คุณ", "ชอบ", "กิน", "ผลไม้", "อะไร"],
        "english": "What fruit do you like to eat?",
        "hints": ["Polite pronoun for 'you'", "to like", "to eat", "fruit", "what"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ผม", "เรียน", "จบ", "มหาวิทยาลัย"],
        "thaiWords": ["ผม", "เรียน", "จบ", "มหาวิทยาลัย"],
        "english": "I graduated from university",
        "hints": ["First person pronoun (male)", "to study", "to graduate", "university"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "คิด", "ว่ามัน", "ดี"],
        "thaiWords": ["ฉัน", "คิด", "ว่ามัน", "ดี"],
        "english": "I think it's good",
        "hints": ["First person pronoun (female)", "to think", "that", "it", "good"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ช่วย", "บอก", "ทาง", "ไป", "สถานีรถไฟ"],
        "thaiWords": ["ช่วย", "บอก", "ทาง", "ไป", "สถานีรถไฟ"],
        "english": "Please tell me the way to the train station",
        "hints": ["to help/please", "to tell", "way/path", "to go", "train station"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "อยาก", "จอง", "โต๊ะ", "สำหรับ", "สอง", "คน"],
        "thaiWords": ["ฉัน", "อยาก", "จอง", "โต๊ะ", "สำหรับ", "สอง", "คน"],
        "english": "I would like to book a table for two",
        "hints": ["First person pronoun (female)", "to want", "to book", "table", "for", "two", "person"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["คุณ", "ช่วย", "แนะนำ", "ร้านอาหาร", "ได้ไหม"],
        "thaiWords": ["คุณ", "ช่วย", "แนะนำ", "ร้านอาหาร", "ได้ไหม"],
        "english": "Can you recommend a restaurant?",
        "hints": ["Polite pronoun for 'you'", "to help", "to recommend", "restaurant", "can/able to (question)"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ผม", "ต้องการ", "หาหมอ"],
        "thaiWords": ["ผม", "ต้องการ", "หาหมอ"],
        "english": "I need to see a doctor",
        "hints": ["First person pronoun (male)", "to need/want", "to find", "doctor"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ฉัน", "จะ", "กลับ", "บ้าน", "ตอน", "ห้า", "โมงเย็น"],
        "thaiWords": ["ฉัน", "จะ", "กลับ", "บ้าน", "ตอน", "ห้า", "โมงเย็น"],
        "english": "I will go home at 5pm",
        "hints": ["First person pronoun (female)", "future marker", "to return", "home", "at", "five", "evening"],
        "difficulty": "intermediate"
      },
      {
        "thai": ["ราคานี้", "รวม", "ภาษี", "หรือ", "ไม่"],
        "thaiWords": ["ราคานี้", "รวม", "ภาษี", "หรือ", "ไม่"],
        "english": "Is this price including tax?",
        "hints": ["this price", "to include", "tax", "or", "not"],
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
        "hints": ["dessert/sweet", "coconut milk", "sweet", "very/many"],
        "difficulty": "advanced"
      },
      {
        "thai": ["เศษ", "ขนม", "ใน", "จาน"],
        "thaiWords": ["เศษ", "ขนม", "ใน", "จาน"],
        "english": "Dessert scraps on the plate",
        "hints": ["scraps/leftovers", "dessert", "in/inside", "plate"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ขนม", "เละ", "เพราะ", "กะทิ", "มาก"],
        "thaiWords": ["ขนม", "เละ", "เพราะ", "กะทิ", "มาก"],
        "english": "The dessert is mushy because there is too much coconut milk",
        "hints": ["dessert", "mushy/soft", "because", "coconut milk", "very/many"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ผม", "ชอบ", "กิน", "ข้าว"],
        "thaiWords": ["ผม", "ชอบ", "กิน", "ข้าว"],
        "english": "I like to eat rice",
        "hints": ["First person pronoun (male)", "to like", "to eat", "rice/food"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ฉัน", "ไม่", "ดู", "หนัง"],
        "thaiWords": ["ฉัน", "ไม่", "ดู", "หนัง"],
        "english": "I don't watch movies",
        "hints": ["First person pronoun (female)", "negative particle", "to watch", "movie/film"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ฉัน", "กำลัง", "วางแผน", "ท่องเที่ยว", "ทั่ว", "เอเชีย"],
        "thaiWords": ["ฉัน", "กำลัง", "วางแผน", "ท่องเที่ยว", "ทั่ว", "เอเชีย"],
        "english": "I am planning to travel around Asia",
        "hints": ["First person pronoun (female)", "continuous marker", "to plan", "to travel", "throughout", "Asia"],
        "difficulty": "advanced"
      },
      {
        "thai": ["เขา", "เพิ่ง", "สำเร็จ", "การศึกษา", "ระดับ", "ปริญญา", "โท"],
        "thaiWords": ["เขา", "เพิ่ง", "สำเร็จ", "การศึกษา", "ระดับ", "ปริญญา", "โท"],
        "english": "He just completed a master's degree",
        "hints": ["he", "just", "to complete", "education", "level", "degree", "master's"],
        "difficulty": "advanced"
      },
      {
        "thai": ["บริษัท", "ของ", "ผม", "กำลัง", "ขยาย", "ตลาด", "สู่", "ยุโรป"],
        "thaiWords": ["บริษัท", "ของ", "ผม", "กำลัง", "ขยาย", "ตลาด", "สู่", "ยุโรป"],
        "english": "My company is expanding the market to Europe",
        "hints": ["company", "of", "First person pronoun (male)", "continuous marker", "to expand", "market", "towards", "Europe"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ฉัน", "ควร", "เตรียม", "เอกสาร", "อะไร", "บ้าง"],
        "thaiWords": ["ฉัน", "ควร", "เตรียม", "เอกสาร", "อะไร", "บ้าง"],
        "english": "What documents should I prepare?",
        "hints": ["First person pronoun (female)", "should", "to prepare", "documents", "what", "some/any"],
        "difficulty": "advanced"
      },
      {
        "thai": ["โปรด", "ระบุ", "เงื่อนไข", "และ", "ข้อกำหนด", "ใน", "สัญญา"],
        "thaiWords": ["โปรด", "ระบุ", "เงื่อนไข", "และ", "ข้อกำหนด", "ใน", "สัญญา"],
        "english": "Please specify the terms and conditions in the contract",
        "hints": ["please", "to specify", "terms", "and", "conditions", "in", "contract"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ผม", "ขอ", "ขยายเวลา", "ส่ง", "รายงาน"],
        "thaiWords": ["ผม", "ขอ", "ขยายเวลา", "ส่ง", "รายงาน"],
        "english": "I would like to request an extension for submission of the report",
        "hints": ["First person pronoun (male)", "to request", "extension of time", "to submit", "report"],
        "difficulty": "advanced"
      },
      {
        "thai": ["เนื่องจาก", "สภาพอากาศ", "ไม่เอื้ออำนวย", "การเดินทาง", "จึง", "ถูกเลื่อน"],
        "thaiWords": ["เนื่องจาก", "สภาพอากาศ", "ไม่เอื้ออำนวย", "การเดินทาง", "จึง", "ถูกเลื่อน"],
        "english": "Due to unfavorable weather, the trip has been postponed",
        "hints": ["due to", "weather condition", "not favorable", "travel", "therefore", "to be postponed"],
        "difficulty": "advanced"
      },
      {
        "thai": ["บริษัท", "มี", "ความตั้งใจ", "ที่จะ", "ลงทุน", "ใน", "นวัตกรรม", "ใหม่"],
        "thaiWords": ["บริษัท", "มี", "ความตั้งใจ", "ที่จะ", "ลงทุน", "ใน", "นวัตกรรม", "ใหม่"],
        "english": "The company intends to invest in new innovations",
        "hints": ["company", "to have", "intention", "to", "to invest", "in", "innovation", "new"],
        "difficulty": "advanced"
      },
      {
        "thai": ["ผม", "กำลัง", "ตรวจสอบ", "งบประมาณ", "สำหรับ", "โครงการ", "นี้"],
        "thaiWords": ["ผม", "กำลัง", "ตรวจสอบ", "งบประมาณ", "สำหรับ", "โครงการ", "นี้"],
        "english": "I am reviewing the budget for this project",
        "hints": ["First person pronoun (male)", "continuous marker", "to review", "budget", "for", "project", "this"],
        "difficulty": "advanced"
      },
      {
        "thai": ["คุณ", "คิดว่า", "ข้อเสนอ", "นี้", "เหมาะสม", "หรือ", "ไม่"],
        "thaiWords": ["คุณ", "คิดว่า", "ข้อเสนอ", "นี้", "เหมาะสม", "หรือ", "ไม่"],
        "english": "Do you think this proposal is appropriate?",
        "hints": ["Polite pronoun for 'you'", "to think that", "proposal", "this", "appropriate", "or", "not"],
        "difficulty": "advanced"
      }
    ]
  }
};