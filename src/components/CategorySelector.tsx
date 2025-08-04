import React from 'react';
import { motion } from 'framer-motion';

export type Category = 'conocernos' | 'emocional' | 'sensual' | 'juguetón' | 'aleatorio';

interface CategoryOption {
  id: Category;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

const categories: CategoryOption[] = [
  {
    id: 'aleatorio',
    label: 'Aleatorio',
    emoji: '🎲',
    color: 'bg-gradient-to-r from-conocernos via-emocional to-sensual text-white border-gray-300',
    description: 'Mezcla de todas las categorías'
  },
  {
    id: 'conocernos',
    label: 'Conocernos',
    emoji: '🍯',
    color: 'bg-conocernos text-conocernos-dark border-conocernos-dark',
    description: 'Preguntas para conocerse mejor'
  },
  {
    id: 'emocional',
    label: 'Emocional',
    emoji: '🌸',
    color: 'bg-emocional text-emocional-dark border-emocional-dark',
    description: 'Conexión emocional profunda'
  },
  {
    id: 'sensual',
    label: 'Sensual',
    emoji: '❤️',
    color: 'bg-sensual text-white border-sensual',
    description: 'Intimidad y sensualidad'
  },
  {
    id: 'juguetón',
    label: 'Juguetón',
    emoji: '🟣',
    color: 'bg-jugueton text-jugueton-dark border-jugueton-dark',
    description: 'Diversión y juego'
  }
];

interface CategorySelectorProps {
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
  onStartGame: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoryToggle,
  onStartGame
}) => {
  const isSelected = (category: Category) => selectedCategories.includes(category);
  
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-wulkan font-bold text-gray-800 mb-2">
          Seleccioná una categoría
        </h2>
        <p className="text-gray-600 font-interphases">
          Elegí el tipo de preguntas que quieren explorar
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            className={`
              w-full p-4 rounded-2xl border-2 transition-all duration-200
              flex items-center space-x-4 text-left
              ${isSelected(category.id) 
                ? `${category.color} border-current shadow-lg scale-105` 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
            onClick={() => onCategoryToggle(category.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{category.emoji}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg font-wulkan">{category.label}</h3>
              <p className="text-sm opacity-75 font-interphases">{category.description}</p>
            </div>
            {isSelected(category.id) && (
              <motion.span
                className="text-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <motion.button
          className="w-full bg-gray-800 text-white p-4 rounded-2xl font-semibold text-lg
                   hover:bg-gray-700 transition-colors duration-200 shadow-lg font-interphases"
          onClick={onStartGame}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          Empezar juego
        </motion.button>
      )}
    </div>
  );
};
