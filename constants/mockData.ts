export interface GameResult {
  playerName: string;
  score: number;
  comboStreak: number;
  rank: number;
  totalPlayers: number;
  accuracy?: number;
  timeTaken?: number;
}

export const MOCK_GAME_RESULT: GameResult = {
  playerName: 'Mallik',
  score: 2840,
  comboStreak: 7,
  rank: 3,
  totalPlayers: 1200,
  accuracy: 94,
  timeTaken: 45,
};
