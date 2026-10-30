export interface Game {
  slug: string;
  title: string;
  language: string;
  entry: string;
  files: string[];
}

export const games: Game[] = [
  {
    slug: "chess",
    title: "Chess",
    language: "Ruby",
    entry: "main.rb",
    files: ["main.rb", "board.rb", "pawn.rb", "rook.rb", "knight.rb", "bishop.rb", "queen.rb", "king.rb"],
  },
  {
    slug: "hangman",
    title: "Hangman",
    language: "Ruby",
    entry: "hangman.rb",
    files: ["hangman.rb", "10000_words.txt"],
  },
  {
    slug: "connect-four",
    title: "Connect Four",
    language: "Ruby",
    entry: "connect_four.rb",
    files: ["connect_four.rb"],
  },
  {
    slug: "mastermind",
    title: "Mastermind",
    language: "Ruby",
    entry: "mastermind.rb",
    files: ["mastermind.rb"],
  },
];
