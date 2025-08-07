import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardModalProps {
  isOpen: boolean;
  reward: string;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, reward, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm w-full card-shadow text-center"
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Gift icon */}
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
              >
                🎁
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-editorial font-thin text-gray-800 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ¡Desbloquearon una experiencia  para profundizar su conexión!
              </motion.h2>

          
              {/* Reward text */}
              <motion.p
                className="text-lg text-gray-700 mb-6 leading-relaxed font-interphases"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {reward}
              </motion.p>

              {/* Close button */}
              <motion.button
                className="bg-emocional text-black font-interphases-mono px-8 py-3 
                         rounded-full font-semibold hover:from-pink-500 hover:to-purple-600 
                         transition-all duration-200 shadow-lg uppercase"
                onClick={onClose}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.95 }}
              >
                ¡Vamos a intentarlo!
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
