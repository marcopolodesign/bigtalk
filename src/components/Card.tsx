import React from 'react';
import { motion, type PanInfo } from 'framer-motion';

export interface Question {
  id: string;
  category: 'conocernos' | 'emocional' | 'sensual' | 'juguetón';
  question: string;
  tone: string;
}

interface CardProps {
  question: Question;
  onSwipe: () => void;
  className?: string;
}

const categoryColors = {
  conocernos: 'bg-conocernos text-conocernos-dark',
  emocional: 'bg-emocional text-emocional-dark',
  sensual: 'bg-sensual text-white',
  juguetón: 'bg-jugueton text-jugueton-dark'
};

const categoryEmojis = {
  conocernos: '🍯',
  emocional: '🌸',
  sensual: '❤️',
  juguetón: '🟣'
};

export const Card: React.FC<CardProps> = ({ question, onSwipe, className = '' }) => {
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe();
    }
  };

  return (
    <motion.div
      className={`
        w-full max-w-sm mx-auto h-96 rounded-3xl card-shadow 
        flex flex-col justify-center items-center p-8 cursor-grab
        active:cursor-grabbing select-none
        ${categoryColors[question.category]}
        ${className}
      `}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <span className="text-2xl">{categoryEmojis[question.category]}</span>
        <span className="text-sm font-medium capitalize opacity-75">
          {question.category}
        </span>
      </div>

      {/* Question text */}
      <div className="text-center">
        <p className="text-xl md:text-2xl font-serif leading-relaxed text-center">
          {question.question}
        </p>
      </div>

      {/* Swipe hints */}
      <div className="absolute bottom-4 w-full flex justify-between px-8 opacity-50">
        <span className="text-sm">←</span>
        <span className="text-xs">desliza</span>
        <span className="text-sm">→</span>
      </div>
    </motion.div>
  );
};
