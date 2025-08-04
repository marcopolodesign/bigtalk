import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Question } from '../components/Card';
import { RewardModal } from '../components/RewardModal';
import { incrementQuestions, getCurrentPlayer, getOtherPlayer, switchTurn, type Player } from '../utils/storage';
import questionsData from '../data/questions.json';
import type { Category } from '../components/CategorySelector';

const categoryColors = {
  conocernos: 'bg-conocernos',
  emocional: 'bg-emocional',
  sensual: 'bg-sensual',
  juguetón: 'bg-jugueton',
  aleatorio: 'bg-gradient-to-br from-conocernos via-emocional to-sensual'
};

const categoryData = [
  { id: 'conocernos', name: 'CONOCERNOS', emoji: '🎯' },
  { id: 'emocional', name: 'EMOCIONAL', emoji: '💭' },
  { id: 'sensual', name: 'SENSUAL', emoji: '💋' },
  { id: 'juguetón', name: 'JUGUETÓN', emoji: '🎪' },
];

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedCategories = useMemo(() => 
    location.state?.categories as Category[] || ['aleatorio'], 
    [location.state?.categories]
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [cardStack, setCardStack] = useState<Question[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [otherPlayer, setOtherPlayer] = useState<Player | null>(null);
  const [progress, setProgress] = useState(0);
  const [showCategorySelection, setShowCategorySelection] = useState(true);
//   const [isResetting, setIsResetting] = useState(false);

  // Initialize questions based on selected categories
  useEffect(() => {
    const allQuestions = questionsData as Question[];
    
    // Load players info
    setCurrentPlayer(getCurrentPlayer());
    setOtherPlayer(getOtherPlayer());
    
    // Get initial progress from localStorage
    const savedData = localStorage.getItem('bigTalkProgress');
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
    
    // Set the first question as current
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
    }
  }, [selectedCategories]);

  const handleSwipe = () => {
    // Track question as answered
    const result = incrementQuestions();
    setProgress(prev => prev + 1);
    
    if (result.shouldShowReward && result.reward) {
      setCurrentReward(result.reward);
      setShowReward(true);
    }
  };

  const handleCategorySelect = async (category: Category) => {
    // Fade out category selection
    setShowCategorySelection(false);
    
    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Increment progress when selecting next question
    setProgress(prev => prev + 1);
    
    // Switch turns before loading new question
    switchTurn();
    setCurrentPlayer(getCurrentPlayer());
    setOtherPlayer(getOtherPlayer());
    
    // Load new question from selected category
    const allQuestions = questionsData as Question[];
    let filteredQuestions: Question[];
    
    if (category === 'aleatorio') {
      filteredQuestions = allQuestions;
    } else {
      filteredQuestions = allQuestions.filter(q => q.category === category);
    }
    
    // Get a random question that hasn't been shown yet
    const availableQuestions = filteredQuestions.filter(q => 
      !cardStack.some(card => card.id === q.id) && 
      q.id !== currentQuestion?.id
    );
    
    if (availableQuestions.length > 0) {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      
      // Add current question to stack and set new question
      if (currentQuestion) {
        setCardStack(prev => [...prev, currentQuestion]);
      }
      setCurrentQuestion(randomQuestion);
      
      // Check if we've reached 5 questions to show congratulations
      if (progress >= 5) {
        setCurrentReward('¡Felicitaciones! Completaron una conversación increíble');
        setShowReward(true);
        return;
      }
      
      // Fade in category selection after card animation
      setTimeout(() => {
        setShowCategorySelection(true);
      }, 600);
    }
  };

  const handleRewardClose = () => {
    setShowReward(false);
    
    // Check if this was the congratulations modal (after 5 questions)
    if (progress >= 5) {
      // Reset everything for a new round
      setProgress(0);
      setCardStack([]);
      
      // Get a new random question
      const allQuestions = questionsData as Question[];
      let filteredQuestions: Question[];
      
      if (selectedCategories.includes('aleatorio')) {
        filteredQuestions = allQuestions;
      } else {
        filteredQuestions = allQuestions.filter(q => 
          selectedCategories.includes(q.category)
        );
      }
      
      const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
      if (shuffled.length > 0) {
        setCurrentQuestion(shuffled[0]);
      }
      
      // Show category selection again
      setShowCategorySelection(true);
    }
  };

  const handleRestart = () => {
    // Clear all game data and go back to player setup
    localStorage.removeItem('bigTalkProgress');
    localStorage.removeItem('bigTalkPlayers');
    navigate('/setup');
  };

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando las preguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Wulkan Display, serif', fontWeight: 700 }}>
          BIG TALK
        </h1>
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
      <div className="relative mb-8 h-96">
        {/* Background cards (stack effect) - positioned vertically */}
        {cardStack.slice(-3).map((card, index) => {
          // index 0 = first card (bottom of stack) = translateY(0)
          // index 1 = second card = translateY(55px) 
          // index 2 = third card (top of stack) = translateY(110px)
          const yOffset = index * 55;
          const randomRotation = Math.random() * 6 - 3; // Random rotation between -3 and 3 degrees
          
          return (
            <motion.div
              key={`stack-${card.id}`}
              className="absolute inset-0"
              style={{
                zIndex: index,
                transform: `translateY(${yOffset}px) rotate(${randomRotation}deg)`,
                opacity: 0.3
              }}
            >
              <div className={`w-full h-full rounded-2xl ${categoryColors[card.category as keyof typeof categoryColors]} p-6 flex flex-col justify-between shadow-lg`}>
                {/* Only show category badge for stacked cards */}
                <div className="flex justify-start">
                  <span 
                    className="inline-block px-4 py-2 bg-white bg-opacity-20 text-white rounded-full uppercase tracking-tight"
                    style={{ 
                      fontFamily: 'TT Interphases Pro Mono, monospace',
                      fontSize: '17.809px',
                      fontWeight: 400,
                      lineHeight: '157.5%',
                      letterSpacing: '-0.89px'
                    }}
                  >
                    {card.category}
                  </span>
                </div>
                {/* Rest of the card content is hidden for stack effect */}
              </div>
            </motion.div>
          );
        })}
        
        {/* Current active card */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ 
                y: `100vh`, // Start from bottom of viewport
                opacity: 0,
                rotate: Math.random() * 10 - 5 // Random rotation between -5 and 5 degrees
              }}
              animate={{ 
                y: Math.min(cardStack.length, 3) * 55, // Dynamic position based on stack size, max 3 cards (165px)
                opacity: 1,
                rotate: Math.random() * 6 - 3 // Random rotation between -3 and 3 degrees when settled
              }}
              exit={{ 
                opacity: 0.3
                // rotation will be maintained automatically since we don't override it
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                rotate: { duration: 0.6 } // Smooth rotation transition
              }}
              
              className="absolute inset-0"
              style={{ zIndex: 10 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 100) {
                  handleSwipe();
                }
              }}
            >
                
              <div className={`w-full h-full rounded-2xl ${categoryColors[currentQuestion.category as keyof typeof categoryColors]} p-6 flex flex-col justify-between shadow-lg cursor-grab active:cursor-grabbing`}>
                {/* Category badge */}
                <div className="flex justify-start">
                  <span 
                    className="inline-block px-4 py-2 bg-white bg-opacity-20 text-white rounded-full uppercase tracking-tight"
                    style={{ 
                      fontFamily: 'TT Interphases Pro Mono, monospace',
                      fontSize: '17.809px',
                      fontWeight: 400,
                      lineHeight: '157.5%',
                      letterSpacing: '-0.89px'
                    }}
                  >
                    {currentQuestion.category}
                  </span>
                </div>
                
                {/* Question text */}
                <div className="flex-1 flex items-center justify-center">
                  <h2 
                    className="text-white text-center"
                    style={{ 
                      fontFamily: 'Wulkan Display, serif',
                      fontSize: '42px',
                      fontWeight: 400,
                      lineHeight: '111%',
                      letterSpacing: '-0.84px'
                    }}
                  >
                    {currentQuestion.question}
                  </h2>
                </div>
                
                {/* Player info */}
                {currentPlayer && otherPlayer && (
                  <div className="text-center">
                    <p className="text-white text-lg opacity-90">
                      Responde: {currentPlayer.name}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category selection section - positioned at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 mb-5 px-4">
        <AnimatePresence>
          {showCategorySelection && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50"
            >
              {/* Category selection text */}
              <div className="mb-4">
                <p className="text-black text-lg font-medium text-center">
                  Seleccioná la categoría de la siguiente pregunta
                </p>
              </div>

              {/* Category buttons */}
              <div className="grid grid-cols-2 gap-3">
                {categoryData.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id as Category)}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-2xl text-white font-medium text-lg uppercase tracking-wide shadow-lg
                      ${categoryColors[category.id as keyof typeof categoryColors]}`}
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
