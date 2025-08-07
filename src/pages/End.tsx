import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getGameState, resetGameState, REWARDS } from '../utils/storage';

export const End: React.FC = () => {
  const navigate = useNavigate();
  const gameState = getGameState();

  const handlePlayAgain = () => {
    navigate('/categories');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReset = () => {
    resetGameState();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex flex-col justify-center items-center p-6 text-white">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Celebration icon */}
        <motion.div
          className="text-8xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          🎉
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-editorial font-thin mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          ¡Qué hermosa conexión!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg opacity-90 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Han compartido {gameState.questionsAnswered} momentos de intimidad y reflexión
        </motion.p>

        {/* Stats */}
        <motion.div
          className="bg-white bg-opacity-20 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Preguntas exploradas:</span>
              <span className="font-semibold">{gameState.questionsAnswered}</span>
            </div>
            <div className="flex justify-between">
              <span>Experiencias desbloqueadas:</span>
              <span className="font-semibold">{Math.floor(gameState.questionsAnswered / 10)}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Unlocked Challenges */}
        {Math.floor(gameState.questionsAnswered / 10) > 0 && (
          <motion.div
            className="bg-white text-gray-800 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="font-editorial font-thin text-xl mb-3 text-left">Experiencias desbloqueadas:</h3>
            <div className="space-y-4 text-left">
              {Array.from({ length: Math.floor(gameState.questionsAnswered / 10) }).map((_, index) => {
                // Get challenges from the REWARDS array in storage.ts using the currentRewardIndex
                const rewardIndex = (gameState.currentRewardIndex - Math.floor(gameState.questionsAnswered / 10) + index) % REWARDS.length;
                return (
                  <div key={`challenge-${index}`} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <p className="text-sm font-medium">{`Desafío ${index + 1}:`}</p>
                    <p className="text-gray-700">{REWARDS[rewardIndex]}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            className="w-full bg-white text-gray-800 p-4 rounded-2xl font-semibold text-lg
                     hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            onClick={handlePlayAgain}
          >
            Jugar otra ronda
          </button>

          <button
            className="w-full border-2 border-white text-white p-4 rounded-2xl font-semibold
                     hover:bg-white hover:text-gray-800 transition-colors duration-200"
            onClick={handleGoHome}
          >
            Volver al inicio
          </button>

          <button
            className="w-full text-white text-sm underline opacity-75 hover:opacity-100 p-2"
            onClick={handleReset}
          >
            Reiniciar progreso
          </button>
        </motion.div>

        {/* Encouraging message */}
        <motion.p
          className="text-sm opacity-75 mt-8 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          "Las mejores conversaciones suceden cuando abrimos el corazón"
        </motion.p>
      </motion.div>
    </div>
  );
};
