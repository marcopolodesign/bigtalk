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
  const [progress, setProgress] = useState(1); // Start at 1/5 instead of 0
  const [showCategorySelection, setShowCategorySelection] = useState(true);
  const [cardRotations, setCardRotations] = useState<Record<string, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
//   const [isResetting, setIsResetting] = useState(false);


useEffect(() => {
      console.log(isRefreshing, otherPlayer)
}, [0] )

  // Initialize questions based on selected categories
  useEffect(() => {
    const allQuestions = questionsData as Question[];
    
    // Load players info
    setCurrentPlayer(getCurrentPlayer());
    setOtherPlayer(getOtherPlayer());

    
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
    
    // Set the first question as current
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
      // Store rotation for the initial question
      setCardRotations(prev => ({
        ...prev,
        [shuffled[0].id]: Math.random() * 6 - 3 // Random rotation between -3 and 3 degrees
      }));
    }
  }, [selectedCategories]);

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
      
      // Store rotation for the new question if it doesn't exist
      if (!cardRotations[randomQuestion.id]) {
        setCardRotations(prev => ({
          ...prev,
          [randomQuestion.id]: Math.random() * 6 - 3 // Random rotation between -3 and 3 degrees
        }));
      }
      
      // 2. Card animates from bottom, then 3. Previous card fades to opacity .3
      
      // Set new question first (triggers animation from bottom)
      setCurrentQuestion(randomQuestion);
      
      // Then add current to stack (with a delay to ensure animation sequence)
      if (currentQuestion) {
        setTimeout(() => {
          setCardStack(prev => [...prev, currentQuestion]);
        }, 100);
      }
      
      // The congratulations message is now handled directly in handleCategorySelect
      // No need to check here again
      
      // Wait for new card animation to complete, then show category selection
      setTimeout(() => {
        // Animation flag should already be false for new cards
        setShowCategorySelection(true);
      }, 1000); // Wait for spring animation to settle
    }
  };

  const handleRewardClose = () => {
    setShowReward(false);
    
    // Always reset progress to 1 after any reward
    setProgress(1); // Reset to 1 as requested
    setCardStack([]);
    setCardRotations({}); // Clear stored rotations
    
    // Get a new random question for the next round
    const allQuestions = questionsData as Question[];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
      setCardRotations(prev => ({
        ...prev,
        [shuffled[0].id]: Math.random() * 6 - 3
      }));
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
    const currentCategory = currentQuestion?.category;
    
    if (!currentCategory) return;
    
    // Get all questions from this same category
    const allQuestions = questionsData as Question[];
    const filteredQuestions = allQuestions.filter(q => q.category === currentCategory);
    
    // Get available questions that haven't been shown yet (exclude current and stack)
    const availableQuestions = filteredQuestions.filter(q => 
      !cardStack.some(card => card.id === q.id) && 
      q.id !== currentQuestion?.id
    );
    
    // If we have available questions, pick a random one
    if (availableQuestions.length > 0) {
      // 2. No card animation, h2 fades out, new content, h2 fades back in
      
      // Set refreshing state to true to trigger text fade animation
      setIsRefreshing(true);
      
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      
      // Keep the exact same rotation for the card to prevent any card animation
      setCardRotations(prev => ({
        ...prev,
        [randomQuestion.id]: cardRotations[currentQuestion.id] || 0 // Keep same rotation for refresh
      }));
      
      // Replace current question with new one (this will trigger text animation via AnimatePresence)
      setCurrentQuestion(randomQuestion);
      
      // Reset refreshing state after animation completes
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
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
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Wulkan Display, serif', fontWeight: 700 }}>
          PILLOW TALK
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
      <div className="relative mb-8">
        {/* Background cards (stack effect) - positioned vertically */}
        {cardStack.slice(-3).map((card, index) => {
          // index 0 = first card (bottom of stack) = translateY(0)
          // index 1 = second card = translateY(55px) 
          // index 2 = third card (top of stack) = translateY(110px)
          const yOffset = index * 55;
          const rotation = cardRotations[card.id] || 0; // Use stored rotation or 0 as fallback
          const isTopCard = index === cardStack.slice(-3).length - 1; // Check if this is the most recent card in stack
          const opacity = isAnimating && isTopCard ? 1 : 0.3; // Keep full opacity for top card during animation
          
          return (
            <motion.div
              key={`stack-${card.id}`}
              className="absolute top-0 left-0 right-0"
              initial={isAnimating && isTopCard ? { opacity: 1 } : undefined}
              animate={{ opacity }}
              transition={{ duration: 0.3, delay: isAnimating && isTopCard ? 0.7 : 0 }} // Delay fade for top card
              style={{
                zIndex: index,
                transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
                width: '100%'
              }}
            >
              <div className={`w-full rounded-2xl ${categoryColors[card.category]} p-6 flex flex-col shadow-lg`}>
                {/* Category badge */}
                <div className="flex justify-start mb-5">
                  <span 
                    className="inline-block px-2 py-2 bg-white bg-opacity-20 text-white rounded-full uppercase tracking-tight"
                    style={{ 
                      fontFamily: 'TT Interphases Pro Mono, monospace',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '157.5%',
                      letterSpacing: '-0.89px'
                    }}
                  >
                    {card.category}
                  </span>
                </div>
                {/* Hidden question text and player info (for consistent height) */}
                <div className="flex flex-col text-left mt-auto opacity-0">
                  <h2 
                    className="text-white text-left mb-5"
                    style={{ 
                      fontFamily: 'Wulkan Display, serif',
                      fontSize: '32px',
                      fontWeight: 300,
                      lineHeight: '111%',
                      letterSpacing: '-0.84px'
                    }}
                  >
                    {card.question}
                  </h2>
                  
                  <p 
                    className="text-white opacity-90 mt-auto"
                    style={{ 
                      fontFamily: 'TT Interphases Pro, sans-serif',
                      fontSize: '16px',
                      fontWeight: 400
                    }}
                  >
                    Responde: Player
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Current active card */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={`card-${currentQuestion.id}-${cardStack.length}`} // Key includes stack length to force animation on new cards
              initial={cardStack.length > 0 ? { 
                y: `calc(100dvh - 200px)`, // New cards come from bottom
                opacity: 0,
                rotate: cardRotations[currentQuestion.id] || 0
              } : { 
                opacity: 0, 
                y: 0,
                rotate: cardRotations[currentQuestion.id] || 0
              }}
              animate={{ 
                y: Math.min(cardStack.length, 3) * 55, // Dynamic position based on stack size
                opacity: 1,
                rotate: cardRotations[currentQuestion.id] || 0
              }}
              exit={{ 
                opacity: 0.3
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                y: { type: 'spring', stiffness: 250, damping: 25 }
              }}
              
              className="absolute top-0 left-0 right-0"
              style={{ zIndex: 10 }}
            >
                
              <div className={`w-full rounded-2xl ${categoryColors[currentQuestion.category]} p-6 flex flex-col shadow-lg`}>
                {/* Category badge */}
                <div className="flex justify-start mb-5">
                  <span 
                    className="inline-block px-2 py-2 bg-white bg-opacity-20 text-white rounded-full uppercase tracking-tight"
                    style={{ 
                      fontFamily: 'TT Interphases Pro Mono, monospace',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '157.5%',
                      letterSpacing: '-0.89px'
                    }}
                  >
                    {currentQuestion.category}
                  </span>
                </div>
                
                {/* Question text with animation for refresh */}
                <div className="flex flex-col text-left mt-auto">
                  {/* Text with separate animation for refresh vs. new card */}
                  <AnimatePresence mode="wait">
                    <motion.h2 
                      key={`question-text-${currentQuestion.id}`} // This key changes on refresh
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-left mb-5"
                      style={{ 
                        fontFamily: 'Wulkan Display, serif',
                        fontSize: '32px',
                        fontWeight: 300,
                        lineHeight: '111%',
                        letterSpacing: '-0.84px'
                      }}
                    >
                      {currentQuestion.question}
                    </motion.h2>
                  </AnimatePresence>
                  
                  {/* Player info with refresh button */}
                  {currentPlayer && (
                    <div className="flex flex-row justify-between items-center w-full">
                      <p 
                        className="text-white opacity-90 mt-auto"
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
                          e.stopPropagation(); // Prevent card click event
                          handleRefreshQuestion();
                        }}
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ rotate: 180 }}
                        animate={{ rotate: [0, 0] }} // Default state
                        transition={{ 
                          rotate: { duration: 0.5 }, 
                          scale: { duration: 0.2 }
                        }}
                        className="text-white opacity-80 hover:opacity-100 p-2"
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
          )}
        </AnimatePresence>
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
                      ${categoryColors[category.id as Category]}`}
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
