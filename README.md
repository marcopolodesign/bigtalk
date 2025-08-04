# Big Talk - Digital Question Game �

A beautiful, mobile-first web application for meaningful conversations. Choose a category, get a thought-provoking question, and deepen your connections with others.

## ✨ Features

- **Mobile-First Design**: Optimized for touch interactions and mobile screens
- **One Question at a Time**: Select a category and get a single meaningful question
- **Return to Categories**: After each question, choose a new category or the same one
- **Category Selection**: Choose from different question types:
  - 🍯 **Conocernos** - Getting to know each other
  - 🌸 **Emocional** - Emotional connection
  - ❤️ **Sensual** - Intimate and sensual questions
  - 🟣 **Juguetón** - Playful and fun
  - 🎲 **Aleatorio** - Random mix of all categories
- **Progress Tracking**: Track questions answered with localStorage
- **Reward System**: Unlock special ideas every 10 questions
- **Question Submission**: Users can submit their own questions
- **Beautiful Animations**: Smooth transitions using Framer Motion
- **Custom Typography**: Uses Wulkandisplay-Regular font for a unique feel

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Card.tsx        # Swipeable question card
│   ├── CategorySelector.tsx  # Category selection interface
│   └── RewardModal.tsx # Reward popup modal
├── data/               # Static data files
│   └── questions.json  # Game questions database
├── pages/              # Main application pages
│   ├── Home.tsx        # Welcome screen
│   ├── Categories.tsx  # Category selection
│   ├── Game.tsx        # Main game interface
│   └── End.tsx         # Game completion screen
├── utils/              # Utility functions
│   └── storage.ts      # localStorage management
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## 🎨 Design System

The app uses a carefully crafted color scheme inspired by the original En Palabras game:

- **Conocernos**: Warm yellow (#EAC86F)
- **Emocional**: Soft pink (#F5D0D0)
- **Sensual**: Deep red (#8D2C2C)
- **Juguetón**: Lilac (#B9A3D5)

## 🔧 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and design system
- **Framer Motion** - Animations and gestures
- **React Router** - Client-side routing

## 📱 Usage

1. **Welcome Screen**: Start the experience with Big Talk
2. **Category Selection**: Choose question types
3. **Question Display**: View one question at a time with swipe interactions
4. **Return to Categories**: After each question, select a new category
5. **Rewards**: Unlock special ideas every 10 questions
6. **Continuous Flow**: Keep exploring different categories and questions

## 🚀 Deployment

Ready for deployment on Vercel:

```bash
# Connect to Vercel
npx vercel

# Deploy
npx vercel --prod
```

## 🔮 Future Enhancements

- Backend integration with Strapi or similar CMS
- User accounts and question history
- Social sharing features
- More question categories
- Custom couple profiles
- Question rating system

## 📄 License

This project is created for personal use and learning purposes.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
