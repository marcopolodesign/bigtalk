import React from 'react';
import { motion } from 'framer-motion';

export interface Question {
  id: string;
  category: 'conocernos' | 'emocional' | 'divertido' | 'picante';
  question: string;
  tone: string;
}

interface CardProps {
  question: Question;
  className?: string;
  currentPlayerName?: string;
}

const categoryColors = {
  conocernos: 'bg-conocernos text-conocernos-dark',
  emocional: 'bg-emocional text-emocional-dark',
  divertido: 'bg-jugueton text-jugueton-dark',
  picante: 'bg-sensual text-white'
};

const categoryEmojis = {
  conocernos: '🍯',
  emocional: '🌸',
  divertido: '🟣',
  picante: '❤️'
};

export const Card: React.FC<CardProps> = ({ question, className = '', currentPlayerName }) => {
  return (
    <motion.div
      className={`
        w-full max-w-sm mx-auto rounded-3xl card-shadow 
        flex flex-col p-8 select-none
        ${categoryColors[question.category]}
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <span className="text-2xl">{categoryEmojis[question.category]}</span>
        <span className="text-xs font-medium uppercase opacity-75 font-interphases-mono rounded-full px-3 py-1 border">
          {question.category}
        </span>
      </div>

      {/* Question text */}
      <div className="text-left w-full">
        <p className="text-xl md:text-2xl font-serif leading-relaxed text-left mb-4">
          {question.question}
        </p>
        <p className="text-sm font-interphases text-gray-600">
          Responde: {currentPlayerName || 'Mateo'}
        </p>
      </div>

      {/* No swipe hints needed */}
    </motion.div>
  );
};
