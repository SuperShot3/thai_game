# Thai Language Sentence Builder Game

An interactive educational game designed to help learners practice Thai language sentence structure through a drag-and-drop interface.

## Features

- Three difficulty levels (Beginner, Intermediate, Advanced)
- Drag-and-drop word arrangement
- Immediate feedback on answers
- English translations for learning support
- Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js (v14 or higher) and npm/yarn
- OR Docker and Docker Compose

### Installation

#### Option 1: Local Development

1. Clone the repository:
```bash
git clone [repository-url]
cd thai-game
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

#### Option 2: Docker Development Environment

1. Clone the repository:
```bash
git clone [repository-url]
cd thai-game
```

2. Build and start the Docker container:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:4444` in both cases.

### Docker Commands

- Start the development environment:
```bash
docker-compose up
```

- Start in detached mode:
```bash
docker-compose up -d
```

- Stop the containers:
```bash
docker-compose down
```

- View logs:
```bash
docker-compose logs -f
```

- Rebuild containers:
```bash
docker-compose up --build
```

## Game Rules

1. Select your difficulty level:
   - Beginner: 3-5 word sentences with English translation
   - Intermediate: 5-8 word sentences with optional hints
   - Advanced: 8+ word sentences with complex grammar

2. Drag and drop the Thai words to form the correct sentence
3. Click "Check Answer" to verify your sentence
4. Use "Try Again" to practice with a new sentence

## Development

### Project Structure

```
src/
├── components/         # React components
├── services/          # Business logic and API calls
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

### Adding New Sentences

To add new sentences, modify the `SAMPLE_SENTENCES` object in `src/services/sentenceGenerator.ts`.

## Future Enhancements

- GPT integration for dynamic sentence generation
- Progress tracking and statistics
- Sound effects and animations
- Additional difficulty levels
- Custom sentence creation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 