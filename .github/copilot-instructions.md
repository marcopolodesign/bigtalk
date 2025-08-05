<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Pillow Talk - Question Game App

This is a mobile-first React + TypeScript + Tailwind CSS application for meaningful conversations called "Pillow Talk".

## Project Guidelines

- Use mobile-first responsive design principles
- Follow the color scheme defined in `tailwind.config.js`:
  - conocernos: warm yellow (#EAC86F)
  - emocional: soft pink (#F5D0D0)  
  - sensual: deep red (#8D2C2C)
  - juguetón: lilac (#B9A3D5)
- Use 'Wulkandisplay-Regular' font for headings and titles
- Use serif typography for questions (Georgia fallback)
- Implement smooth animations using Framer Motion
- Store game progress in localStorage
- Focus on beautiful, minimal UI design
- Ensure accessibility and smooth touch interactions

## Game Flow

- User selects a category
- Shows ONE question from that category
- After viewing the question (swipe or button), returns to category selection
- User chooses the same or different category for next question
- Rewards unlock every 10 questions

## Key Features

- One question at a time workflow
- Category selection between each question
- Category-based question filtering
- Progress tracking and rewards system
- Question submission form
- Mobile-optimized touch gestures

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS for styling with custom Wulkandisplay-Regular font
- Framer Motion for animations
- React Router for navigation
- localStorage for persistence
