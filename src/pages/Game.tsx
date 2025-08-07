import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Question } from '../components/Card';
import { RewardModal } from '../components/RewardModal';
import { PillowTalkLogo } from '../components/PillowTalkLogo';
import { incrementQuestions, getCurrentPlayer, switchTurn, type Player } from '../utils/storage';
import questionsData from '../data/questions.json';
import type { Category } from '../components/CategorySelector';

const categoryHexColors = {
  conocernos: '#EAC86F',
  emocional: '#F5D0D0',
  divertido: '#B9A3D5',
  picante: '#8D2C2C',
  aleatorio: '#A73936'
};

const getCategoryColor = (category: string): string => {
  return categoryHexColors[category as keyof typeof categoryHexColors] || '#A73936';
};

const getCategoryGradient = (category: string): string => {
  if (category === 'picante') {
    return 'linear-gradient(180deg, #EE0F0F -24.97%, #FFB2A2 50%)';
  }
  return `linear-gradient(180deg, ${getCategoryColor(category)} -.47%, #FFF 70%)`;
};

const categoryButtonColors = {
  conocernos: 'bg-conocernos',
  emocional: 'bg-emocional',
  divertido: 'bg-jugueton',
  picante: 'bg-sensual',
  aleatorio: 'bg-gradient-to-br from-conocernos via-emocional to-sensual'
};

const categoryData = [
  { id: 'conocernos', name: 'CONOCERNOS', emoji: '🎯' },
  { id: 'emocional', name: 'EMOCIONAL', emoji: '💭' },
  { id: 'divertido', name: 'DIVERTIDO', emoji: '🎪' },
  { id: 'picante', name: 'PICANTE', emoji: '💋' },
  { id: 'aleatorio', name: 'ALEATORIO', emoji: '🎲' },
];

interface CardState {
  question: Question;
  isActive: boolean;
  rotation: number;
  position: number; // 0 = active (top), 1 = first in stack, 2 = second, etc.
  hasFaded: boolean; // Track if this card has already been faded to 0.3
}

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedCategories = useMemo(() => 
    location.state?.categories as Category[] || ['aleatorio'], 
    [location.state?.categories]
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [cards, setCards] = useState<CardState[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [progress, setProgress] = useState(1); // Start at 1/5 instead of 0
  const [showCategorySelection, setShowCategorySelection] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
//   const [isResetting, setIsResetting] = useState(false);

  // Initialize questions based on selected categories
  useEffect(() => {
    const allQuestions = questionsData as Question[];
    
    // Load players info
    setCurrentPlayer(getCurrentPlayer());

    
    // Get initial progress from localStorage
    const savedData = localStorage.getItem('pillowTalkProgress');
    if (savedData) {
      const data = JSON.parse(savedData);
      setProgress(data.answeredQuestions?.length || 0);
    }
    
    let filteredQuestions: Question[];
    
    if (selectedCategories.includes('aleatorio')) {
      // If aleatorio is selected, use all questions
      filteredQuestions = allQuestions;
    } else {
      // Filter by selected categories
      filteredQuestions = allQuestions.filter(q => 
        selectedCategories.includes(q.category)
      );
    }
    
    // Shuffle questions and pick one random question
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    
    // Set the first question as current with new card structure
    if (shuffled.length > 0) {
      const initialCard: CardState = {
        question: shuffled[0],
        isActive: true,
        rotation: Math.random() * 6 - 3, // Random rotation between -3 and 3 degrees
        position: 0, // Active card is at position 0
        hasFaded: false // Initial card hasn't been faded yet
      };
      setCards([initialCard]);
    }
  }, [selectedCategories]);

  // Helper functions for the new card structure
  const getCurrentQuestion = (): Question | null => {
    const activeCard = cards.find(card => card.isActive);
    return activeCard ? activeCard.question : null;
  };

  const addNewCard = (question: Question) => {
    setCards(prev => {
      // Move all existing cards down one position and make them inactive
      // Cards that reach position 2+ should be marked as faded
      const updatedCards = prev.map(card => ({
        ...card,
        isActive: false,
        position: card.position + 1,
        hasFaded: card.position >= 1 ? true : card.hasFaded // Mark as faded if moving to position 2+
      }));
      
      // Add the new card as active at position 0
      const newCard: CardState = {
        question,
        isActive: true,
        rotation: Math.random() * 6 - 3,
        position: 0,
        hasFaded: false // New active cards haven't been faded
      };
      
      // Keep only the last 4 cards (active + 3 in stack)
      // Append the new card at the end so it renders last in DOM
      return [...updatedCards, newCard].slice(0, 4);
    });
  };

  const refreshCurrentCard = (newQuestion: Question) => {
    setCards(prev => prev.map(card => 
      card.isActive 
        ? { ...card, question: newQuestion, rotation: card.rotation } // Keep same rotation for refresh
        : card
    ));
  };

  // const handleSwipe = () => {
  //   // Track question as answered
  //   const result = incrementQuestions();
  //   setProgress(prev => prev + 1);
    
  //   if (result.shouldShowReward && result.reward) {
  //     setCurrentReward(result.reward);
  //     setShowReward(true);
  //   }
  // };

  const handleCategorySelect = async (category: Category) => {
    // 1. User clicks on category
    // Fade out category selection
    setShowCategorySelection(false);
    
    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Calculate the next progress value
    const nextProgress = progress + 1;
    
    // Check if this will be the final question (the 5th one)
    const isCompletingRound = nextProgress === 5; // Now using 1-based counting (1-5)
    
    // Track question as answered
    const result = incrementQuestions();
    
    // Check if we should show the congratulations message (exactly at the 5th question)
    if (isCompletingRound) {
      console.log("Showing congratulations at 5th question (progress=4)"); // Debug message
      
      // Get a random reward from the REWARDS array for the congratulations message
      const { REWARDS } = await import('../utils/storage');
      const randomIndex = Math.floor(Math.random() * REWARDS.length);
      const randomReward = REWARDS[randomIndex];
      
      // Show the reward
      setCurrentReward(randomReward);
      setShowReward(true);
      setProgress(nextProgress); // Update to 4/5
      return; // Exit early to show congratulations first
    }
    
    // Check if a milestone reward should be shown (rewards from REWARDS array)
    // Only show milestone rewards after completing a full round, not during a round
    if (result.shouldShowReward && result.reward && progress === 5) {
      console.log("Showing milestone reward after completing a round:", result.reward); // Debug message
      setCurrentReward(result.reward);
      setShowReward(true);
      setProgress(1); // Reset progress to 1 after showing milestone reward
      return; // Exit early to show reward first
    }
    
    // Update progress counter
    setProgress(nextProgress);
    
    // Switch turns before loading new question
    switchTurn();
    setCurrentPlayer(getCurrentPlayer());
    
    // Load new question from selected category
    const allQuestions = questionsData as Question[];
    let filteredQuestions: Question[];
    
    if (category === 'aleatorio') {
      filteredQuestions = allQuestions;
    } else {
      filteredQuestions = allQuestions.filter(q => q.category === category);
    }
    
    // Get a random question that hasn't been shown yet
    const currentQuestion = getCurrentQuestion();
    const availableQuestions = filteredQuestions.filter(q => 
      !cards.some(card => card.question.id === q.id) && 
      q.id !== currentQuestion?.id
    );
    
    if (availableQuestions.length > 0) {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      
      // Set animation state to true to prevent stack cards from fading immediately
      setIsAnimating(true);
      
      // Add the new card using our helper function
      addNewCard(randomQuestion);
      
      // Wait for new card animation to complete, then fade stack and show category selection
      setTimeout(() => {
        setIsAnimating(false); // This will now trigger the stack fade after new card is in position
        
        // Mark all non-active cards as faded
        setCards(prev => prev.map(card => 
          card.isActive ? card : { ...card, hasFaded: true }
        ));
        
        setShowCategorySelection(true);
      }, 800); // Reduced from 1000ms to 800ms to match the spring animation better
    }
  };

  const handleRewardClose = () => {
    setShowReward(false);
    
    // Always reset progress to 1 after any reward
    setProgress(1); // Reset to 1 as requested
    setCards([]); // Clear all cards
    
    // Get a new random question for the next round
    const allQuestions = questionsData as Question[];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) {
      const initialCard: CardState = {
        question: shuffled[0],
        isActive: true,
        rotation: Math.random() * 6 - 3,
        position: 0,
        hasFaded: false // Initial card after reward hasn't been faded
      };
      setCards([initialCard]);
    }
    
    // Show category selection for the next round
    setIsAnimating(false);
    setShowCategorySelection(true);
  };

  // Function to refresh the current question with another from the same category
  const handleRefreshQuestion = () => {
    // 1. User clicks on refresh button
    
    // Prevent refresh during animations
    if (isAnimating) return;
    
    // Get the current question's category
    const currentQuestion = getCurrentQuestion();
    const currentCategory = currentQuestion?.category;
    
    if (!currentCategory) return;
    
    // Get all questions from this same category
    const allQuestions = questionsData as Question[];
    const filteredQuestions = allQuestions.filter(q => q.category === currentCategory);
    
    // Get available questions that haven't been shown yet (exclude current and stack)
    const availableQuestions = filteredQuestions.filter(q => 
      !cards.some(card => card.question.id === q.id) && 
      q.id !== currentQuestion?.id
    );
    
    // If we have available questions, pick a random one
    if (availableQuestions.length > 0) {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      
      // Use the refresh helper function
      refreshCurrentCard(randomQuestion);
    } else {
      // If no available questions in this category
      console.log('No more questions available in this category');
    }
  };

  const handleRestart = () => {
    // Clear all game data and go back to player setup
    localStorage.removeItem('pillowTalkProgress');
    localStorage.removeItem('pillowTalkPlayers');
    navigate('/setup');
  };

  const currentQuestion = getCurrentQuestion();

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando las preguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <PillowTalkLogo className="text-black h-8" width={130} height={32} />
        <div className="flex items-center gap-3 text-right text-black">
          <span 
            className="text-lg font-normal uppercase tracking-tight"
            style={{ 
              fontFamily: 'TT Interphases Pro Mono, monospace',
              fontSize: '17.809px',
              fontWeight: 400,
              lineHeight: '157.5%',
              letterSpacing: '-0.89px'
            }}
          >
            {progress}/5
          </span>
          <motion.button
            onClick={handleRestart}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Reiniciar experiencia"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path 
                d="M15 3H21V9M21 3L13.5 10.5M9 6H7C5.89543 6 5 6.89543 5 8V16C5 17.1046 5.89543 18 7 18H15C16.1046 18 17 17.1046 17 16V14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative mb-8">
        {/* All cards (both active and stack) rendered with unified logic */}
        {cards.map((cardState) => {
          // Reverse the yOffset calculation: position 0 (newest) gets highest offset
          const yOffset = (cards.length - 1 - cardState.position) * 55;
          const isActive = cardState.isActive;
          // Once a card has faded, it stays at 0.3 opacity permanently
          const opacity = isActive ? 1 : (cardState.hasFaded ? 0.3 : (isAnimating ? 1 : 0.3));
          // Z-index: higher position = lower z-index, active card gets highest
          const zIndex = isActive ? 10 : (10 - cardState.position);
          
          return (
            <AnimatePresence key={`card-${cardState.question.id}`} mode="wait">
              <motion.div
                initial={isActive && cards.length > 1 ? { 
                  y: `calc(100dvh - 200px)`, // New active cards come from bottom
                  opacity: 0,
                  rotate: cardState.rotation
                } : { 
                  opacity: isActive ? 0 : 1, 
                  y: yOffset,
                  rotate: cardState.rotation
                }}
                animate={{ 
                  y: yOffset,
                  opacity: opacity,
                  rotate: cardState.rotation
                }}
                exit={{ 
                  opacity: 0.3
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  y: { type: 'spring', stiffness: 250, damping: 25 },
                  opacity: { 
                    duration: 0.4, 
                    delay: !isActive && !isAnimating ? 0.2 : 0 
                  }
                }}
                className="absolute top-0 left-0 right-0"
                style={{ zIndex }}
              >
                <div className={`w-full rounded-2xl p-6 flex flex-col shadow-lg`} 
                     style={{ 
                       background: getCategoryGradient(cardState.question.category)
                     }}>
                  {/* Category badge */}
                  <div className="flex justify-start mb-5">
                    <span 
                      className="inline-block px-2 py-1 bg-black bg-opacity-10 text-black rounded-full uppercase tracking-tight"
                      style={{ 
                        fontFamily: 'TT Interphases Pro Mono, monospace',
                        fontSize: '11px',
                        fontWeight: 400,
                        lineHeight: '157.5%',
                        letterSpacing: '-0.89px'
                      }}
                    >
                      {cardState.question.category}
                    </span>
                  </div>
                  
                  {/* Question text and player info */}
                  <div className={`flex flex-col text-left mt-auto ${!isActive ? 'opacity-0' : ''}`}>
                    <h2 className="text-black text-left mb-5 font-editorial font-thin text-3xl leading-tight tracking-tight">
                      {cardState.question.question}
                    </h2>
                    
                    {/* Player info with refresh button - only show on active card */}
                    {isActive && currentPlayer && (
                      <div className="flex flex-row justify-between items-center w-full">
                        <p 
                          className="text-black opacity-90 mt-auto"
                          style={{ 
                            fontFamily: 'TT Interphases Pro, sans-serif',
                            fontSize: '16px',
                            fontWeight: 400
                          }}
                        >
                          Responde: {currentPlayer.name}
                        </p>
                        
                        {/* Refresh button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefreshQuestion();
                          }}
                          whileTap={{ scale: 0.85 }}
                          whileHover={{ rotate: 180 }}
                          animate={{ rotate: [0, 0] }}
                          transition={{ 
                            rotate: { duration: 0.5 }, 
                            scale: { duration: 0.2 }
                          }}
                          className="text-black opacity-80 hover:opacity-100 p-2"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          >
                            <path d="M3 2v6h6"></path>
                            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                            <path d="M21 22v-6h-6"></path>
                            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                          </svg>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {/* Category selection section - positioned at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 mb-5 px-4 pb-safe">
        <AnimatePresence>
          {showCategorySelection && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category selection text */}
              <div className="mb-4">
                <h2 className="text-black text-sm font-thin text-left font-interphases">
                  Seleccioná la categoría de la siguiente pregunta
                </h2>
              </div>

              {/* Category buttons */}
              <div className="flex flex-wrap gap-2">
                {categoryData.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id as Category)}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full text-white font-medium text-xs uppercase tracking-wide font-interphases-mono
                      ${categoryButtonColors[category.id as Category]}`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reward Modal */}
      <RewardModal
        isOpen={showReward}
        reward={currentReward}
        onClose={handleRewardClose}
      />
    </div>
  );
};
