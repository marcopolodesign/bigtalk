// Storage utilities for Pillow Talk game

export interface Player {
  name: string;
  id: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  totalQuestions: number;
  rewards: string[];
  questionsAnswered: number;
  currentRewardIndex: number;
  userQuestions: string[];
  gameStarted: boolean;
}

export interface Question {
  id: string;
  question: string;
  category: string;
}

const STORAGE_KEYS = {
  GAME_STATE: 'pillow-talk-game-state',
  USER_QUESTIONS: 'pillow-talk-user-questions'
};

// Reward suggestions that unlock every 10 questions
export const REWARDS = [
  "✨ Desafío de Conexión: Esta semana, envíense un mensaje cada día compartiendo algo que admiran del otro. Verán cómo crece su aprecio mutuo.",
  "🔥 Desafío Sensorial: Esta noche, véndense los ojos por turnos y exploren sus sentidos con diferentes texturas, sabores o sonidos.",
  "💌 Recuerden Juntos: Tómense 20 minutos para escribir recuerdos de cómo se conocieron y luego compártanlos. ¡Descubrirán detalles que habían olvidado!",
  "🌙 Ritual Nocturno: Antes de dormir, compartan 3 cosas por las que están agradecidos hoy. Este hábito fortalecerá su conexión cada noche.",
  "🧠 Pregunta Desbloqueada: ¿Si pudieran viajar juntos a cualquier lugar del mundo mañana mismo, dónde sería y por qué?",
  "❤️ Secreto Compartido: Cuéntense algo que nunca le hayan dicho a otra persona. La vulnerabilidad crea confianza profunda.",
  "🎭 Juego de Roles: Intercambien personalidades por una hora. Entender la perspectiva del otro creará más empatía entre ustedes.",
  "📱 Detox Digital: Desconéctense de dispositivos por 3 horas y creen algo juntos: una comida, un dibujo, o simplemente una conversación sin distracciones.",
  "💭 Pregunta Desbloqueada: ¿Cuál es el sueño que han postergado y cómo podrían apoyarse mutuamente para hacerlo realidad?",
  "🌈 Reto Creativo: Escriban juntos una lista de 10 experiencias que quieran vivir este año. ¡Comprométanse a cumplir al menos 3!",
  "🔮 Viaje al Futuro: Descríbanse mutuamente cómo imaginan su vida juntos en 5 años. Compartan detalles específicos y sueños compartidos.",
  "💫 Pregunta Desbloqueada: Si pudieran desarrollar una nueva habilidad o talento instantáneamente, ¿cuál elegirían y cómo cambiaría su vida?"
];

// Get current game state
export const getGameState = (): GameState => {
  const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing game state:', error);
    }
  }
  
  return {
    questionsAnswered: 0,
    currentRewardIndex: 0,
    userQuestions: [],
    players: [],
    currentPlayerIndex: 0,
    totalQuestions: 0,
    rewards: [],
    gameStarted: false
  };
};

// Update game state
export const updateGameState = (newState: Partial<GameState>): void => {
  const currentState = getGameState();
  const updatedState = { ...currentState, ...newState };
  localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(updatedState));
};

// Increment questions answered and check for rewards
export const incrementQuestions = (): { shouldShowReward: boolean; reward?: string } => {
  const state = getGameState();
  const newCount = state.questionsAnswered + 1;
  
  updateGameState({ questionsAnswered: newCount });
  
  // Check if user should get a reward (every 10 questions)
  // Original logic: if (newCount % 10 === 0) {
  if (newCount % 3 === 0) { // For testing - show rewards more frequently (every 3 questions)
    const rewardIndex = state.currentRewardIndex % REWARDS.length;
    const reward = REWARDS[rewardIndex];
    
    updateGameState({ currentRewardIndex: rewardIndex + 1 });
    
    return { shouldShowReward: true, reward };
  }
  
  return { shouldShowReward: false };
};

// Add user-submitted question
export const addUserQuestion = (question: string): void => {
  const state = getGameState();
  const newQuestions = [...state.userQuestions, question];
  updateGameState({ userQuestions: newQuestions });
};

// Get user-submitted questions
export const getUserQuestions = (): string[] => {
  return getGameState().userQuestions;
};

// Reset game state (for testing/debugging)
export const resetGameState = (): void => {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
};

// Player management functions
export const setPlayers = (player1Name: string, player2Name: string): void => {
  const players: Player[] = [
    { name: player1Name, id: 'player1' },
    { name: player2Name, id: 'player2' }
  ];
  
  updateGameState({ 
    players, 
    gameStarted: true,
    currentPlayerIndex: 0 
  });
};

export const getCurrentPlayer = (): Player | null => {
  const state = getGameState();
  if (state.players.length === 0) return null;
  return state.players[state.currentPlayerIndex];
};

export const getOtherPlayer = (): Player | null => {
  const state = getGameState();
  if (state.players.length === 0) return null;
  const otherIndex = state.currentPlayerIndex === 0 ? 1 : 0;
  return state.players[otherIndex];
};

export const switchTurn = (): void => {
  const state = getGameState();
  const newPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
  updateGameState({ currentPlayerIndex: newPlayerIndex });
};
