import React from 'react';
import { motion } from 'framer-motion';

export type Category = 'conocernos' | 'emocional' | 'divertido' | 'picante' | 'aleatorio';

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
    id: 'divertido',
    label: 'Divertido',
    emoji: '🟣',
    color: 'bg-jugueton text-jugueton-dark border-jugueton-dark',
    description: 'Diversión y juego'
  },
  {
    id: 'picante',
    label: 'Picante',
    emoji: '❤️',
    color: 'bg-sensual text-white border-sensual',
    description: 'Intimidad y sensualidad'
  }
];

interface CategorySelectorProps {
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
  onStartGame: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoryToggle,
  onStartGame
}) => {
  const isSelected = (category: Category) => selectedCategories.includes(category);

  const handleCategoryClick = (category: Category) => {
    onCategoryToggle(category);
    // Auto-start the game with the selected category
    onStartGame(category);
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-wulkan font-light text-gray-800 mb-2">
          Seleccioná una categoría
        </h2>
        <p className="text-gray-600 font-interphases">
          Seleccioná el tipo de la primer pregunta a responder
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            className={`
              w-full p-4 rounded-full border-2 transition-all duration-200
              flex items-center space-x-4 text-left
              ${isSelected(category.id) 
                ? `${category.color} border-current shadow-lg scale-105` 
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
            onClick={() => handleCategoryClick(category.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">{category.emoji}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm font-interphases-mono uppercase">{category.label}</h3>
              <p className="text-xs opacity-75 font-interphases">{category.description}</p>
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
    </div>
  );
};
