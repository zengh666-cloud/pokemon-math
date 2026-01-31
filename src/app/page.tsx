'use client';

import { useState, useEffect, useCallback } from 'react';

// Starter Pokemon data with fun sprites
const POKEMON_LIST = [
  { id: 1, name: 'Pikachu', emoji: '⚡', color: '#f6e05e' },
  { id: 2, name: 'Charmander', emoji: '🔥', color: '#fc8181' },
  { id: 3, name: 'Squirtle', emoji: '💧', color: '#63b3ed' },
  { id: 4, name: 'Bulbasaur', emoji: '🌿', color: '#68d391' },
  { id: 5, name: 'Eevee', emoji: '🦊', color: '#d6bcfa' },
  { id: 6, name: 'Jigglypuff', emoji: '🎀', color: '#fbb6ce' },
  { id: 7, name: 'Meowth', emoji: '😺', color: '#faf089' },
  { id: 8, name: 'Psyduck', emoji: '🦆', color: '#fbd38d' },
  { id: 9, name: 'Snorlax', emoji: '😴', color: '#a0aec0' },
  { id: 10, name: 'Togepi', emoji: '🥚', color: '#fef3c7' },
  { id: 11, name: 'Gengar', emoji: '👻', color: '#9f7aea' },
  { id: 12, name: 'Ditto', emoji: '🫠', color: '#e9d8fd' },
  { id: 13, name: 'Mew', emoji: '✨', color: '#fed7e2' },
  { id: 14, name: 'Magikarp', emoji: '🐟', color: '#feb2b2' },
  { id: 15, name: 'Dragonite', emoji: '🐉', color: '#fbd38d' },
];

type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
};

type Pokemon = {
  id: number;
  name: string;
  emoji: string;
  color: string;
};

type GameState = 'menu' | 'playing' | 'correct' | 'newPokemon' | 'collection';

function generateProblem(difficulty: number): Problem {
  const useSubtraction = difficulty > 1 && Math.random() > 0.6;
  
  let max = 5;
  if (difficulty === 2) max = 10;
  if (difficulty >= 3) max = 20;
  
  let num1: number, num2: number, answer: number;
  const operator: '+' | '-' = useSubtraction ? '-' : '+';
  
  if (operator === '+') {
    num1 = Math.floor(Math.random() * max) + 1;
    num2 = Math.floor(Math.random() * max) + 1;
    answer = num1 + num2;
  } else {
    // For subtraction, ensure positive result
    num1 = Math.floor(Math.random() * max) + 2;
    num2 = Math.floor(Math.random() * num1) + 1;
    answer = num1 - num2;
  }
  
  return { num1, num2, operator, answer };
}

function generateChoices(answer: number): number[] {
  const choices = new Set<number>([answer]);
  
  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrongAnswer = Math.random() > 0.5 ? answer + offset : Math.max(0, answer - offset);
    if (wrongAnswer !== answer && wrongAnswer >= 0) {
      choices.add(wrongAnswer);
    }
  }
  
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [collectedPokemon, setCollectedPokemon] = useState<Pokemon[]>([]);
  const [newPokemon, setNewPokemon] = useState<Pokemon | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('pokemon-math-save');
    if (saved) {
      const data = JSON.parse(saved);
      setCollectedPokemon(data.collectedPokemon || []);
      setScore(data.score || 0);
      setDifficulty(data.difficulty || 1);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (collectedPokemon.length > 0 || score > 0) {
      localStorage.setItem('pokemon-math-save', JSON.stringify({
        collectedPokemon,
        score,
        difficulty,
      }));
    }
  }, [collectedPokemon, score, difficulty]);

  const startGame = useCallback(() => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setChoices(generateChoices(newProblem.answer));
    setGameState('playing');
    setSelectedAnswer(null);
    setIsWrong(false);
  }, [difficulty]);

  const checkAnswer = (answer: number) => {
    if (!problem || selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    
    if (answer === problem.answer) {
      const newScore = score + (10 * difficulty);
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      
      // Check if earned a new Pokemon (every 3 correct answers)
      if (newStreak > 0 && newStreak % 3 === 0) {
        const uncollected = POKEMON_LIST.filter(
          p => !collectedPokemon.some(cp => cp.id === p.id)
        );
        
        if (uncollected.length > 0) {
          const randomPokemon = uncollected[Math.floor(Math.random() * uncollected.length)];
          setNewPokemon(randomPokemon);
          setCollectedPokemon([...collectedPokemon, randomPokemon]);
          setTimeout(() => setGameState('newPokemon'), 800);
          return;
        }
      }
      
      setGameState('correct');
      setTimeout(() => startGame(), 1000);
    } else {
      setIsWrong(true);
      setStreak(0);
      setTimeout(() => {
        setIsWrong(false);
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const continueAfterPokemon = () => {
    setNewPokemon(null);
    startGame();
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-2 animate-bounce-slow">
            🧮 Math Quest! 🎮
          </h1>
          <p className="text-xl text-amber-700">Catch Pokemon by solving math!</p>
        </div>
        
        <div className="flex gap-3 text-4xl mb-8 animate-float">
          {['⚡', '🔥', '💧', '🌿'].map((emoji, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>{emoji}</span>
          ))}
        </div>
        
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={startGame}
            className="w-full py-5 px-8 bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            ▶️ Play!
          </button>
          
          <button
            onClick={() => setGameState('collection')}
            className="w-full py-4 px-8 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            🎒 My Pokemon ({collectedPokemon.length}/{POKEMON_LIST.length})
          </button>
          
          <div className="bg-white/50 rounded-2xl p-4">
            <p className="text-amber-800 font-bold mb-2">Difficulty:</p>
            <div className="flex gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                    difficulty === d
                      ? 'bg-amber-500 text-white scale-105'
                      : 'bg-white text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {d === 1 ? '🌟' : d === 2 ? '⭐⭐' : '💫💫💫'}
                </button>
              ))}
            </div>
            <p className="text-sm text-amber-600 mt-2 text-center">
              {difficulty === 1 && 'Easy: Numbers 1-5'}
              {difficulty === 2 && 'Medium: Numbers 1-10'}
              {difficulty === 3 && 'Hard: Numbers 1-20'}
            </p>
          </div>
        </div>
        
        {score > 0 && (
          <p className="mt-6 text-amber-700 font-bold">⭐ Total Stars: {score}</p>
        )}
      </div>
    );
  }

  // Collection Screen
  if (gameState === 'collection') {
    return (
      <div className="min-h-screen p-6 safe-area-top safe-area-bottom">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setGameState('menu')}
            className="py-2 px-4 bg-white/70 rounded-xl text-amber-800 font-bold"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-amber-800">My Pokemon!</h2>
          <div className="w-16"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {POKEMON_LIST.map((pokemon) => {
            const collected = collectedPokemon.some(p => p.id === pokemon.id);
            return (
              <div
                key={pokemon.id}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all ${
                  collected
                    ? 'bg-white shadow-lg'
                    : 'bg-gray-300/50'
                }`}
                style={collected ? { backgroundColor: pokemon.color + '40' } : {}}
              >
                <span className={`text-4xl ${collected ? '' : 'grayscale opacity-30'}`}>
                  {collected ? pokemon.emoji : '❓'}
                </span>
                <span className={`text-xs font-bold mt-1 ${collected ? 'text-gray-700' : 'text-gray-400'}`}>
                  {collected ? pokemon.name : '???'}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-amber-800 font-bold text-lg">
            {collectedPokemon.length} / {POKEMON_LIST.length} Pokemon caught!
          </p>
          {collectedPokemon.length === POKEMON_LIST.length && (
            <p className="text-2xl mt-2 animate-sparkle">🏆 You caught them all! 🏆</p>
          )}
        </div>
      </div>
    );
  }

  // New Pokemon Screen
  if (gameState === 'newPokemon' && newPokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-top safe-area-bottom">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            🎉 New Pokemon! 🎉
          </h2>
          
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-4 animate-celebrate shadow-2xl"
            style={{ backgroundColor: newPokemon.color }}
          >
            <span className="text-7xl">{newPokemon.emoji}</span>
          </div>
          
          <h3 className="text-4xl font-bold text-gray-800 mb-2">{newPokemon.name}</h3>
          <p className="text-xl text-amber-700 mb-8">joined your team!</p>
          
          <button
            onClick={continueAfterPokemon}
            className="py-4 px-12 bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            Keep Playing! 🚀
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen flex flex-col p-4 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setGameState('menu')}
          className="py-2 px-4 bg-white/70 rounded-xl text-amber-800 font-bold"
        >
          ← Menu
        </button>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-amber-800">⭐ {score}</span>
          <span className="text-lg font-bold text-amber-800">🔥 {streak}</span>
        </div>
      </div>
      
      {/* Progress to next Pokemon */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm text-amber-700">Next Pokemon:</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`text-xl ${i < (streak % 3) ? 'opacity-100' : 'opacity-30'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>
      
      {/* Problem */}
      {problem && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className={`bg-white rounded-3xl shadow-xl p-8 mb-8 ${isWrong ? 'animate-wiggle bg-red-100' : ''} ${gameState === 'correct' ? 'bg-green-100' : ''}`}>
            <div className="text-6xl font-bold text-center text-gray-800">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>
          </div>
          
          {/* Answer Choices */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {choices.map((choice, i) => {
              const isSelected = selectedAnswer === choice;
              const isCorrectAnswer = choice === problem.answer;
              const showCorrect = selectedAnswer !== null && isCorrectAnswer;
              const showWrong = isSelected && !isCorrectAnswer;
              
              return (
                <button
                  key={i}
                  onClick={() => checkAnswer(choice)}
                  disabled={selectedAnswer !== null}
                  className={`py-6 text-4xl font-bold rounded-2xl shadow-lg transition-all ${
                    showCorrect
                      ? 'bg-green-400 text-white scale-105'
                      : showWrong
                      ? 'bg-red-400 text-white'
                      : 'bg-white text-gray-800 hover:bg-amber-100 active:scale-95'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          
          {gameState === 'correct' && (
            <div className="mt-6 text-4xl animate-pop">
              {['🎉', '⭐', '✨', '🌟'][Math.floor(Math.random() * 4)]} Great job!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
