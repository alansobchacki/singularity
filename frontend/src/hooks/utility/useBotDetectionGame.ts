import { useState, useEffect } from "react";
import { UserType } from "../../interfaces/user/User";
import { toast } from "react-toastify";

type GuessType = "REGULAR" | "BOT";

const useBotDetectionGame = () => {
  const [scores, setScores] = useState({ correct: 0, total: 0 });
  const [guessedPosts, setGuessedPosts] = useState<Record<string, boolean>>({});
  const [guessedRight, setGuessedRight] = useState<boolean | null>(null);

  useEffect(() => {
    const savedScores = localStorage.getItem("botDetectionScores");
    const savedGuesses = localStorage.getItem("botDetectionGuesses");

    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedGuesses) setGuessedPosts(JSON.parse(savedGuesses));
  }, []);

  const makeGuess = (
    authorId: string,
    userType: UserType,
    guess: GuessType
  ) => {
    const isCorrect = userType === guess;
    setGuessedRight(isCorrect);

    if (isCorrect) {
      toast.success("You guessed right! 🥳");
    } else {
      toast.error("You guessed wrong. 😔");
    }

    const newScores = {
      correct: isCorrect ? scores.correct + 1 : scores.correct,
      total: scores.total + 1,
    };

    const newGuessedPosts = {
      ...guessedPosts,
      [authorId]: true,
    };

    setScores(newScores);
    setGuessedPosts(newGuessedPosts);

    localStorage.setItem("botDetectionScores", JSON.stringify(newScores));
    localStorage.setItem(
      "botDetectionGuesses",
      JSON.stringify(newGuessedPosts)
    );
  };

  const hasGuessedPost = (authorId: string) => guessedPosts[authorId] || false;

  return { scores, makeGuess, hasGuessedPost, guessedRight };
};

export default useBotDetectionGame;
