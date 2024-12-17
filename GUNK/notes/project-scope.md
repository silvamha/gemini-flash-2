# Harper 2.0 - Project Scope

## Project Overview

A streamlined, single-page chat application using Google's Gemini API, deployed on Netlify with serverless functions.

## Architecture

```md
harper-2.0/
├── netlify/
│   └── functions/
│       ├── chat.js           # Handles Gemini API communication
│       └── harperPersonality.js  # Harper's personality config
├── public/
│   ├── index.html           # Single page application
│   ├── main.js             # Frontend logic
│   └── style.css           # Styling
├── data/                   # RAG knowledge base
├── assets/                 # Images and other static files
├── notes/
│   └── project-scope.md    # Project documentation
└── .env                    # Environment variables
```

## Core Features

1. Chat Interface
   - Real-time message display
   - Message history in localStorage
   - Typing indicators
   - Error handling
   - Dark/light mode switching

2. Harper's Personality
   - Full personality implementation
   - Context maintenance
   - Memory through chat sessions
   - Professional/personal mode switching

3. RAG Implementation (Phase 2)
   - Knowledge base integration
   - Document embedding
   - Context-aware responses
  
4. Required - SAFETY RULES
   - Implement safety rules to avoid BLOCKED Candidate from Google
   - SIMPLE CODING OVER EFFICIENT CODING EVEN IF IT MAKES THE CODE LONGER. IT NEEDS TO BE EASY FOR A BEGINNER TO READ

## Dependencies

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.1.3",
    "@netlify/functions": "^2.4.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "netlify-cli": "^17.10.1"
  }
}
```

## Environment Variables

```env
GEMINI_API_KEY=your_api_key_here
```

## Development Workflow

1. Local Development
   - Use `netlify dev` for local testing
   - Hot reload enabled
   - Environment variables loaded from .env

2. Deployment
   - Push to GitHub
   - Netlify auto-deployment
   - Environment variables set in Netlify dashboard

## Security Considerations

1. API Key Protection
   - Never exposed to frontend
   - Managed through Netlify functions

2. Content Safety
   - Gemini safety settings maintained
   - Professional mode for public interactions
   - Personal mode for private chats

## Phase 1 Milestones

1. Basic Setup
   - [ ] Project scaffolding
   - [ ] Dependencies installation
   - [ ] Environment configuration

2. Core Implementation
   - [ ] Chat interface
   - [ ] Harper's personality integration
   - [ ] Message handling
   - [ ] Local storage setup

3. Testing & Refinement
   - [ ] Chat functionality
   - [ ] Memory persistence
   - [ ] Error handling
   - [ ] Performance optimization

## Future Enhancements (Phase 2)

1. RAG Integration
2. Voice Interface
3. Multi-language Support
4. Advanced Memory Management

## Installation Instructions

```bash
# Clone repository (if using Git)
git clone [repository-url]

# Install dependencies
npm install

# Install Netlify CLI globally
npm install -g netlify-cli

# Create .env file
touch .env
# Add your Gemini API key to .env

# Start development server
netlify dev
```

## Notes

- Keep code clear over efficient
- Maintain Harper's full personality
- Test thoroughly before deployment
- Document all changes

*** Heather's notes and suggestions below
