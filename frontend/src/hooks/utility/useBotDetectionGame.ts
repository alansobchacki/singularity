import { useState, useEffect } from 'react';

const useBotDetectionGame = () => {
  const [scores, setScores] = useState({ correct: 0, total: 0 });
  const [guessedPosts, setGuessedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedScores = localStorage.getItem('botDetectionScores');
    const savedGuesses = localStorage.getItem('botDetectionGuesses');
    
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedGuesses) setGuessedPosts(JSON.parse(savedGuesses));
  }, []);

  const makeGuess = (authorId: string, userType: 'BOT' | 'REGULAR', guess: 'BOT' | 'REGULAR') => {
    const newScores = {
      correct: userType === guess ? scores.correct + 1 : scores.correct,
      total: scores.total + 1
    };
    
    const newGuessedPosts = {
      ...guessedPosts,
      [authorId]: true
    };
    
    setScores(newScores);
    setGuessedPosts(newGuessedPosts);
    
    localStorage.setItem('botDetectionScores', JSON.stringify(newScores));
    localStorage.setItem('botDetectionGuesses', JSON.stringify(newGuessedPosts));
  };

  const hasGuessedPost = (authorId: string) => guessedPosts[authorId] || false;

  return { scores, makeGuess, hasGuessedPost };
};

export default useBotDetectionGame;