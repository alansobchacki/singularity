export interface Game {
  slug: string;
  title: string;
  language: string;
  description: string;
  entry: string;
  files: string[];
}

export const games: Game[] = [
  {
    slug: "chess",
    title: "Chess",
    language: "Ruby",
    description:
      "Play chess against a basic computer opponent. Select pieces with the WASD keys and capture them when they turn green.",
    entry: "main.rb",
    files: ["main.rb", "board.rb", "pawn.rb", "rook.rb", "knight.rb", "bishop.rb", "queen.rb", "king.rb"],
  },
  {
    slug: "hangman",
    title: "Hangman",
    language: "Ruby",
    description:
      "Guess the hidden word one letter at a time. Pick a difficulty, and save your game to finish it later.",
    entry: "hangman.rb",
    files: ["hangman.rb", "10000_words.txt"],
  },
  {
    slug: "connect-four",
    title: "Connect Four",
    language: "Ruby",
    description:
      "Drop your tokens and line up four in a row before the computer does.",
    entry: "connect_four.rb",
    files: ["connect_four.rb"],
  },
  {
    slug: "mastermind",
    title: "Mastermind",
    language: "Ruby",
    description:
      "Break a four-digit code made of numbers from 1 to 6, or build one and watch the computer try to crack it.",
    entry: "mastermind.rb",
    files: ["mastermind.rb"],
  },
];
