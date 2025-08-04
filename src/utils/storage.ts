// Storage utilities for Big Talk game

export interface Player {
  name: string;
  id: string;
}

export interface GameState {
  questionsAnswered: number;
  currentRewardIndex: number;
  userQuestions: string[];
  players: Player[];
  currentPlayerIndex: number;
  gameStarted: boolean;
}

const STORAGE_KEYS = {
  GAME_STATE: 'big-talk-game-state',
  USER_QUESTIONS: 'big-talk-user-questions'
};

// Reward suggestions that unlock every 10 questions
export const REWARDS = [
  "Preparale el desayuno en la cama",
  "Dale un masaje de 15 minutos",
  "Escribile una carta de amor",
  "Planea una cita sorpresa",
  "Cocinen juntos su comida favorita",
  "Organiza una noche de películas",
  "Comprale flores sin motivo",
  "Dedícale su canción favorita",
  "Hagan un picnic en casa",
  "Regálale un día libre de responsabilidades"
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
  if (newCount % 10 === 0) {
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
