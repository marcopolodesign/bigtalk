import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { setPlayers } from '../utils/storage';

export const PlayerSetup: React.FC = () => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (player1Name.trim() && player2Name.trim()) {
      setPlayers(player1Name.trim(), player2Name.trim());
      navigate('/categories');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
        
        {/* PILLOW TALK title */}
        <h1 className="text-2xl font-bold text-black tracking-wider">PILLOW TALK</h1>
        
        <div className="w-8 h-8"></div> {/* Spacer */}
      </div>

      {/* Player Setup Form */}
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            ¿Quiénes van a jugar?
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Ingresen sus nombres para comenzar
          </motion.p>
        </div>

        {/* Form */}
        <form onSubmit={handleStartGame} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jugador 1
            </label>
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl 
                       focus:outline-none focus:border-pink-400 transition-colors duration-200"
              placeholder="Tu nombre"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jugador 2
            </label>
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl
                       focus:outline-none focus:border-pink-400 transition-colors duration-200"
              placeholder="Nombre de tu compañero"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className={`
              w-full p-4 rounded-2xl font-semibold text-lg transition-all duration-200
              ${player1Name.trim() && player2Name.trim()
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            disabled={!player1Name.trim() || !player2Name.trim()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileTap={player1Name.trim() && player2Name.trim() ? { scale: 0.98 } : undefined}
          >
            {!player1Name.trim() || !player2Name.trim() 
              ? 'Completa ambos nombres' 
              : 'Comenzar a jugar'
            }
          </motion.button>
        </form>

        {/* Info box */}
        <motion.div
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-sm text-blue-700 text-center">
            <span className="font-semibold">💡 Cómo funciona:</span><br />
            Se turnan para hacer y responder preguntas. El que pregunta elige la categoría.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
