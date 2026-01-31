'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

// Sound effects using Web Audio API
function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available:', e);
    }
  }, [getAudioContext]);

  const playCorrect = useCallback(() => {
    // Happy high-pitched ding
    playTone(880, 0.15, 'sine', 0.3);
  }, [playTone]);

  const playWrong = useCallback(() => {
    // Low buzz
    playTone(150, 0.3, 'sawtooth', 0.2);
  }, [playTone]);

  const playPokemonCaught = useCallback(() => {
    // Triumphant jingle - 3 ascending notes
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 'sine', 0.3), i * 150);
    });
  }, [getAudioContext, playTone]);

  return { playCorrect, playWrong, playPokemonCaught };
}

// Real Gen 1 Pokemon with PokeAPI sprites
const POKEMON_LIST = [
  { id: 25, name: 'Pikachu', color: '#f6e05e' },
  { id: 4, name: 'Charmander', color: '#fc8181' },
  { id: 7, name: 'Squirtle', color: '#63b3ed' },
  { id: 1, name: 'Bulbasaur', color: '#68d391' },
  { id: 133, name: 'Eevee', color: '#d6bcfa' },
  { id: 39, name: 'Jigglypuff', color: '#fbb6ce' },
  { id: 52, name: 'Meowth', color: '#faf089' },
  { id: 54, name: 'Psyduck', color: '#fbd38d' },
  { id: 143, name: 'Snorlax', color: '#a0aec0' },
  { id: 94, name: 'Gengar', color: '#9f7aea' },
  { id: 132, name: 'Ditto', color: '#e9d8fd' },
  { id: 151, name: 'Mew', color: '#fed7e2' },
  { id: 129, name: 'Magikarp', color: '#feb2b2' },
  { id: 149, name: 'Dragonite', color: '#fbd38d' },
  { id: 6, name: 'Charizard', color: '#f97316' },
];

const getSpriteUrl = (id: number) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

// SVG Icons
const StarIcon = ({ filled = true, size = 24 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FireIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#ef4444" stroke="#dc2626" strokeWidth="1">
    <path d="M12 2c0 5-4 7-4 12 0 3.31 2.69 6 6 6s6-2.69 6-6c0-7-8-8-8-12z" />
    <path d="M12 22c-2.21 0-4-1.79-4-4 0-3 3-4 3-7 0 3 5 4 5 7 0 2.21-1.79 4-4 4z" fill="#fbbf24" stroke="none" />
  </svg>
);

const PlayIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const BackpackIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10V20a2 2 0 002 2h12a2 2 0 002-2V10" />
    <path d="M9 6a3 3 0 116 0" />
    <rect x="2" y="10" width="20" height="4" rx="1" fill="white" stroke="white" />
  </svg>
);

const RocketIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
    <path d="M12 2L8 12h8L12 2z" />
    <rect x="10" y="12" width="4" height="8" />
    <path d="M6 18l4-2v4l-4-2z" />
    <path d="M18 18l-4-2v4l4-2z" />
    <circle cx="12" cy="10" r="2" fill="#fbbf24" />
  </svg>
);

const TrophyIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1">
    <path d="M6 2h12v6a6 6 0 11-12 0V2z" />
    <path d="M6 4H3v4a3 3 0 003 3" />
    <path d="M18 4h3v4a3 3 0 01-3 3" />
    <rect x="9" y="14" width="6" height="4" />
    <rect x="7" y="18" width="10" height="3" rx="1" />
  </svg>
);

const PartyIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
    <polygon points="12 2 14 10 22 10 16 15 18 23 12 18 6 23 8 15 2 10 10 10" fill="#fbbf24" stroke="#f59e0b" />
  </svg>
);

const CalculatorIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#854d0e" stroke="#854d0e" strokeWidth="1">
    <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="#854d0e" strokeWidth="2" />
    <rect x="6" y="4" width="12" height="5" fill="#a3e635" />
    <circle cx="8" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="16" cy="12" r="1.5" />
    <circle cx="8" cy="16" r="1.5" />
    <circle cx="12" cy="16" r="1.5" />
    <circle cx="16" cy="16" r="1.5" />
    <circle cx="8" cy="20" r="1.5" />
    <circle cx="12" cy="20" r="1.5" />
    <circle cx="16" cy="20" r="1.5" />
  </svg>
);

const GamepadIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#854d0e">
    <rect x="2" y="6" width="20" height="12" rx="3" />
    <circle cx="7" cy="12" r="2" fill="white" />
    <circle cx="17" cy="10" r="1.5" fill="#ef4444" />
    <circle cx="17" cy="14" r="1.5" fill="#3b82f6" />
    <rect x="5" y="11" width="4" height="2" rx="0.5" fill="white" />
    <rect x="6" y="10" width="2" height="4" rx="0.5" fill="white" />
  </svg>
);

const QuestionIcon = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" fill="#e5e7eb" />
    <path d="M9 9a3 3 0 115.12 2.12c-.63.63-1.12 1.3-1.12 2.38" />
    <circle cx="12" cy="17" r="1" fill="#9ca3af" />
  </svg>
);

type Problem = {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
};

type Pokemon = {
  id: number;
  name: string;
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
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showScorePop, setShowScorePop] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  
  const { playCorrect, playWrong, playPokemonCaught } = useSoundEffects();

  // Pastel colors for answer buttons
  const buttonColors = ['answer-btn-pink', 'answer-btn-blue', 'answer-btn-green', 'answer-btn-yellow'];

  // Get next uncollected Pokemon for preview
  const getNextPokemon = () => {
    const uncollected = POKEMON_LIST.filter(
      p => !collectedPokemon.some(cp => cp.id === p.id)
    );
    return uncollected.length > 0 ? uncollected[0] : null;
  };

  useEffect(() => {
    const saved = localStorage.getItem('pokemon-math-save-v2');
    if (saved) {
      const data = JSON.parse(saved);
      setCollectedPokemon(data.collectedPokemon || []);
      setScore(data.score || 0);
      setDifficulty(data.difficulty || 1);
    }
  }, []);

  useEffect(() => {
    if (collectedPokemon.length > 0 || score > 0) {
      localStorage.setItem('pokemon-math-save-v2', JSON.stringify({
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
      playCorrect();
      setCorrectAnswer(answer);
      const points = 10 * difficulty;
      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      
      // Trigger score pop animation
      setEarnedPoints(points);
      setShowScorePop(true);
      setTimeout(() => setShowScorePop(false), 1000);
      
      if (newStreak > 0 && newStreak % 3 === 0) {
        const uncollected = POKEMON_LIST.filter(
          p => !collectedPokemon.some(cp => cp.id === p.id)
        );
        
        if (uncollected.length > 0) {
          const randomPokemon = uncollected[Math.floor(Math.random() * uncollected.length)];
          setNewPokemon(randomPokemon);
          setCollectedPokemon([...collectedPokemon, randomPokemon]);
          setTimeout(() => {
            playPokemonCaught();
            setGameState('newPokemon');
          }, 800);
          return;
        }
      }
      
      setGameState('correct');
      setTimeout(() => {
        setCorrectAnswer(null);
        startGame();
      }, 1000);
    } else {
      playWrong();
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
        {/* Main card container - centered cohesive unit */}
        <div className="w-full max-w-sm bg-white/95 rounded-3xl shadow-2xl p-6 space-y-5 border-2 border-amber-200/50">
          {/* Title section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-800 mb-2 animate-bounce-slow flex items-center justify-center gap-2">
              <CalculatorIcon size={36} /> Math Quest! <GamepadIcon size={36} />
            </h1>
            <p className="text-lg text-amber-700">Catch Pokemon by solving math!</p>
          </div>
          
          {/* Pokemon showcase - bigger sprites */}
          <div className="flex justify-center gap-2 animate-float py-3 bg-gradient-to-r from-amber-200/70 to-yellow-200/70 rounded-2xl shadow-inner">
            {[25, 4, 7, 1].map((id, i) => (
              <Image
                key={id}
                src={getSpriteUrl(id)}
                alt="Pokemon"
                width={96}
                height={96}
                className="drop-shadow-lg hover:scale-110 transition-transform"
                style={{ animationDelay: `${i * 0.2}s` }}
                unoptimized
              />
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full py-5 px-8 bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              <PlayIcon size={28} /> Play!
            </button>
            
            <button
              onClick={() => setGameState('collection')}
              className="w-full py-4 px-8 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              <BackpackIcon size={24} /> My Pokemon ({collectedPokemon.length}/{POKEMON_LIST.length})
            </button>
          </div>
          
          {/* Difficulty selector */}
          <div className="bg-white/70 rounded-2xl p-4">
            <p className="text-amber-800 font-bold mb-3 text-center">Difficulty:</p>
            <div className="flex gap-2">
              {[
                { level: 1, label: 'Easy', desc: 'Numbers 1-5' },
                { level: 2, label: 'Medium', desc: 'Numbers 1-10' },
                { level: 3, label: 'Hard', desc: 'Numbers 1-20' },
              ].map(({ level, label }) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-3 rounded-xl font-bold text-base transition-all flex flex-col items-center justify-center gap-1 ${
                    difficulty === level
                      ? 'bg-amber-500 text-white scale-105 shadow-md'
                      : 'bg-white text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: level }).map((_, i) => (
                      <StarIcon key={i} size={16} filled={difficulty === level} />
                    ))}
                  </div>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-amber-600 mt-3 text-center">
              {difficulty === 1 && 'Numbers 1-5'}
              {difficulty === 2 && 'Numbers 1-10, with subtraction!'}
              {difficulty === 3 && 'Numbers 1-20, challenge mode!'}
            </p>
          </div>
          
          {/* Score display */}
          {score > 0 && (
            <p className="text-amber-700 font-bold flex items-center justify-center gap-2 text-lg">
              <StarIcon size={24} /> Total Stars: {score}
            </p>
          )}
        </div>
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
                    : 'bg-gray-200/70'
                }`}
                style={collected ? { backgroundColor: pokemon.color + '40' } : {}}
              >
                <Image
                  src={getSpriteUrl(pokemon.id)}
                  alt={collected ? pokemon.name : '???'}
                  width={64}
                  height={64}
                  className={collected ? 'drop-shadow-md' : 'pokemon-silhouette'}
                  unoptimized
                />
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
            <p className="text-2xl mt-2 animate-sparkle flex items-center justify-center gap-2">
              <TrophyIcon size={32} /> You caught them all! <TrophyIcon size={32} />
            </p>
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
          <h2 className="text-3xl font-bold text-amber-800 mb-6 flex items-center justify-center gap-2">
            <PartyIcon size={32} /> New Pokemon! <PartyIcon size={32} />
          </h2>
          
          {/* Pokemon showcase - bigger sprite, smaller circle ratio */}
          <div
            className="w-48 h-48 rounded-full flex items-center justify-center mx-auto mb-6 animate-celebrate shadow-2xl border-4 border-white/50"
            style={{ backgroundColor: newPokemon.color }}
          >
            <Image
              src={getSpriteUrl(newPokemon.id)}
              alt={newPokemon.name}
              width={160}
              height={160}
              className="drop-shadow-lg scale-150"
              unoptimized
            />
          </div>
          
          <h3 className="text-4xl font-bold text-gray-800 mb-2">{newPokemon.name}</h3>
          <p className="text-xl text-amber-700 mb-8">joined your team!</p>
          
          <button
            onClick={continueAfterPokemon}
            className="py-4 px-12 bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3 mx-auto"
          >
            Keep Playing! <RocketIcon size={28} />
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen
  // Encouraging messages for below the answers
  const encouragements = [
    "You've got this!",
    "Math superstar!",
    "Keep going!",
    "You're doing great!",
    "Almost there!",
  ];
  const encouragement = encouragements[streak % encouragements.length];

  const nextPokemon = getNextPokemon();
  const progressPercent = ((streak % 3) / 3) * 100;
  const streakSize = Math.min(24 + streak * 2, 40); // Grows with streak, max 40px

  return (
    <div className="min-h-screen flex flex-col p-4 safe-area-top safe-area-bottom relative">
      {/* Background decorations */}
      <div className="bg-decorations" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <button
          onClick={() => setGameState('menu')}
          className="py-2 px-4 bg-white/70 rounded-xl text-amber-800 font-bold text-lg"
        >
          ← Menu
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-amber-800 flex items-center gap-1 relative">
            <StarIcon size={24} /> {score}
            {/* Score pop animation */}
            {showScorePop && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-green-500 font-bold text-lg animate-score-pop">
                +{earnedPoints}
              </span>
            )}
          </span>
          <span className={`streak-flame ${streak >= 5 ? 'streak-hot' : ''}`} style={{ fontSize: `${streakSize}px` }}>
            <FireIcon size={streakSize} />
            <span className="text-amber-800 font-bold" style={{ fontSize: `${Math.min(20 + streak, 28)}px` }}>
              {streak}
            </span>
          </span>
        </div>
      </div>
      
      {/* Progress bar with Pokemon preview */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center gap-3 justify-center">
          <span className="text-sm text-amber-700 font-medium">Next:</span>
          <div className="flex-1 max-w-[200px]">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {nextPokemon ? (
            <Image
              src={getSpriteUrl(nextPokemon.id)}
              alt="Next Pokemon"
              width={36}
              height={36}
              className="pokemon-silhouette"
              unoptimized
            />
          ) : (
            <span className="text-2xl">🏆</span>
          )}
        </div>
      </div>
      
      {/* Problem - flex-1 centered as cohesive unit */}
      {problem && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-6 w-full max-w-sm px-2">
            {/* Problem card with more presence */}
            <div className={`problem-card bg-white rounded-3xl shadow-2xl px-8 py-8 w-full ${isWrong ? 'animate-wiggle bg-red-100' : ''} ${gameState === 'correct' ? 'bg-green-100' : ''}`}>
              <div className="text-5xl sm:text-6xl font-bold text-center text-gray-800">
                {problem.num1} {problem.operator} {problem.num2} = ?
              </div>
            </div>
            
            {/* Answer Choices - Colorful pastel buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {choices.map((choice, i) => {
                const isSelected = selectedAnswer === choice;
                const isCorrectAnswer = choice === problem.answer;
                const showCorrect = selectedAnswer !== null && isCorrectAnswer;
                const showWrong = isSelected && !isCorrectAnswer;
                const isCorrectPop = correctAnswer === choice;
                
                return (
                  <button
                    key={i}
                    onClick={() => checkAnswer(choice)}
                    disabled={selectedAnswer !== null}
                    className={`w-full py-6 text-4xl font-bold rounded-2xl shadow-lg transition-all ${
                      showCorrect
                        ? 'bg-green-400 text-white border-green-500'
                        : showWrong
                        ? 'bg-red-400 text-white border-red-500'
                        : `${buttonColors[i]} text-gray-700 active:scale-95`
                    } ${isCorrectPop ? 'animate-correct-pop' : ''}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            
            {/* Fun element below answers */}
            <div className="flex flex-col items-center">
              {gameState === 'correct' ? (
                <div className="text-2xl animate-pop flex items-center gap-2">
                  <PartyIcon size={32} /> Great job! <PartyIcon size={32} />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-5 py-3 shadow-md">
                  <Image
                    src={getSpriteUrl(25)}
                    alt="Pikachu cheering"
                    width={48}
                    height={48}
                    className="animate-bounce-slow"
                    unoptimized
                  />
                  <span className="text-lg text-amber-700 font-bold">{encouragement}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
