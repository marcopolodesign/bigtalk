import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategorySelector, type Category } from '../components/CategorySelector';
import { motion } from 'framer-motion';
import { getGameState, getCurrentPlayer, getOtherPlayer, switchTurn, type Player } from '../utils/storage';

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [otherPlayer, setOtherPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const gameState = getGameState();
    
    // Check if players are set up
    if (!gameState.gameStarted || gameState.players.length === 0) {
      navigate('/setup');
      return;
    }
    
    setCurrentPlayer(getCurrentPlayer());
    setOtherPlayer(getOtherPlayer());
  }, [navigate]);

  const handleCategoryToggle = (category: Category) => {
    if (category === 'aleatorio') {
      // If aleatorio is selected, clear all others and select only aleatorio
      setSelectedCategories(['aleatorio']);
    } else {
      // Remove aleatorio if selecting a specific category
      const withoutAleatorio = selectedCategories.filter(c => c !== 'aleatorio');
      
      if (selectedCategories.includes(category)) {
        // Remove category if already selected
        setSelectedCategories(withoutAleatorio.filter(c => c !== category));
      } else {
        // Add category
        setSelectedCategories([...withoutAleatorio, category]);
      }
    }
  };

  const handleStartGame = (category: Category) => {
    // Set the selected category and navigate immediately
    navigate('/game', { state: { categories: [category] } });
  };

  const handleSwitchPlayer = () => {
    switchTurn();
    setCurrentPlayer(getOtherPlayer());
    setOtherPlayer(getCurrentPlayer());
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-2">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* PILLOW TALK in Monument Extended Bold */}
        <h1 className="font-monument text-lg tracking-wider">PILLOW TALK</h1>
        
        {/* Empty div to maintain spacing */}
        <div className="w-8"></div>
      </div>

   

      {/* Category selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <CategorySelector
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onStartGame={handleStartGame}
        />


           {/* Current Player Info */}
      {currentPlayer && (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-interphases text-gray-600 mb-3">
            Arranca contestando primero: <span className="font-semibold text-gray-800">{currentPlayer.name}</span>
          </p>
          {otherPlayer && (
            <button
              onClick={handleSwitchPlayer}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-interphases
                       hover:bg-gray-200 transition-colors duration-200 border border-gray-300"
            >
              Cambiar a {otherPlayer.name}
            </button>
          )}
        </motion.div>
      )}
      </motion.div>
    </div>
  );
};
