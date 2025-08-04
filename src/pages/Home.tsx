import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, name?: string, email?: string) => void;
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim(), name.trim() || undefined, email.trim() || undefined);
      setQuestion('');
      setName('');
      setEmail('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-6 max-w-md w-full card-shadow"
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.7, y: 50 }}
      >
        <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">
          Agrega tu propia pregunta
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
              rows={3}
              placeholder="Escribe tu pregunta..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Tu nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Tu email (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600"
            >
              Enviar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSubmitQuestion = (question: string, name?: string, email?: string) => {
    // For MVP, just log the question - later integrate with backend
    console.log('New question submitted:', { question, name, email });
    // You could also save to localStorage here
    alert('¡Gracias por tu pregunta! La revisaremos pronto.');
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col justify-center items-center p-6 text-white">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo/Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-wulkan font-bold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Big Talk
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Preguntas que acercan corazones
        </motion.p>

        {/* Decorative hearts */}
        <motion.div
          className="flex justify-center space-x-4 mb-12"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className="text-3xl">💕</span>
          <span className="text-2xl">✨</span>
          <span className="text-3xl">💕</span>
        </motion.div>

        {/* Main CTA */}
        <motion.button
          className="w-full bg-white text-gray-800 p-4 rounded-2xl font-semibold text-lg mb-4
                   hover:bg-gray-100 transition-colors duration-200 shadow-lg font-interphases"
          onClick={() => navigate('/setup')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileTap={{ scale: 0.98 }}
        >
          Empezar
        </motion.button>

        {/* Secondary actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button
            className="block w-full text-white text-sm underline opacity-75 hover:opacity-100"
            onClick={() => setShowHowItWorks(true)}
          >
            ¿Cómo funciona?
          </button>
          
          <button
            className="block w-full text-white text-sm underline opacity-75 hover:opacity-100"
            onClick={() => setShowSubmitModal(true)}
          >
            Agregar mi propia pregunta
          </button>
        </motion.div>
      </motion.div>

      {/* How it works modal */}
      {showHowItWorks && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 max-w-md w-full card-shadow text-gray-800"
            initial={{ scale: 0.7, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 50 }}
          >
            <h3 className="text-xl font-serif font-bold mb-4">¿Cómo funciona?</h3>
            <div className="space-y-3 text-sm">
              <p>🎯 <strong>Elige categorías:</strong> Selecciona el tipo de preguntas que quieren explorar</p>
              <p>💬 <strong>Desliza las cartas:</strong> Lee cada pregunta y desliza para la siguiente</p>
              <p>🎁 <strong>Desbloquea ideas:</strong> Cada 10 preguntas obtienes una sorpresa</p>
              <p>💕 <strong>Conecta:</strong> Hablen, rían y conózcanse mejor</p>
            </div>
            <button
              className="w-full bg-pink-500 text-white p-3 rounded-xl mt-6 hover:bg-pink-600"
              onClick={() => setShowHowItWorks(false)}
            >
              ¡Entendido!
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Submit question modal */}
      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitQuestion}
      />
    </div>
  );
};
