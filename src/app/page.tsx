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

// Type colors for Pokemon
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

// All 151 Gen 1 Pokemon
const POKEMON_LIST = [
  { id: 1, name: 'Bulbasaur', type: 'grass' }, { id: 2, name: 'Ivysaur', type: 'grass' }, { id: 3, name: 'Venusaur', type: 'grass' },
  { id: 4, name: 'Charmander', type: 'fire' }, { id: 5, name: 'Charmeleon', type: 'fire' }, { id: 6, name: 'Charizard', type: 'fire' },
  { id: 7, name: 'Squirtle', type: 'water' }, { id: 8, name: 'Wartortle', type: 'water' }, { id: 9, name: 'Blastoise', type: 'water' },
  { id: 10, name: 'Caterpie', type: 'bug' }, { id: 11, name: 'Metapod', type: 'bug' }, { id: 12, name: 'Butterfree', type: 'bug' },
  { id: 13, name: 'Weedle', type: 'bug' }, { id: 14, name: 'Kakuna', type: 'bug' }, { id: 15, name: 'Beedrill', type: 'bug' },
  { id: 16, name: 'Pidgey', type: 'normal' }, { id: 17, name: 'Pidgeotto', type: 'normal' }, { id: 18, name: 'Pidgeot', type: 'normal' },
  { id: 19, name: 'Rattata', type: 'normal' }, { id: 20, name: 'Raticate', type: 'normal' },
  { id: 21, name: 'Spearow', type: 'normal' }, { id: 22, name: 'Fearow', type: 'normal' },
  { id: 23, name: 'Ekans', type: 'poison' }, { id: 24, name: 'Arbok', type: 'poison' },
  { id: 25, name: 'Pikachu', type: 'electric' }, { id: 26, name: 'Raichu', type: 'electric' },
  { id: 27, name: 'Sandshrew', type: 'ground' }, { id: 28, name: 'Sandslash', type: 'ground' },
  { id: 29, name: 'Nidoran♀', type: 'poison' }, { id: 30, name: 'Nidorina', type: 'poison' }, { id: 31, name: 'Nidoqueen', type: 'poison' },
  { id: 32, name: 'Nidoran♂', type: 'poison' }, { id: 33, name: 'Nidorino', type: 'poison' }, { id: 34, name: 'Nidoking', type: 'poison' },
  { id: 35, name: 'Clefairy', type: 'fairy' }, { id: 36, name: 'Clefable', type: 'fairy' },
  { id: 37, name: 'Vulpix', type: 'fire' }, { id: 38, name: 'Ninetales', type: 'fire' },
  { id: 39, name: 'Jigglypuff', type: 'normal' }, { id: 40, name: 'Wigglytuff', type: 'normal' },
  { id: 41, name: 'Zubat', type: 'poison' }, { id: 42, name: 'Golbat', type: 'poison' },
  { id: 43, name: 'Oddish', type: 'grass' }, { id: 44, name: 'Gloom', type: 'grass' }, { id: 45, name: 'Vileplume', type: 'grass' },
  { id: 46, name: 'Paras', type: 'bug' }, { id: 47, name: 'Parasect', type: 'bug' },
  { id: 48, name: 'Venonat', type: 'bug' }, { id: 49, name: 'Venomoth', type: 'bug' },
  { id: 50, name: 'Diglett', type: 'ground' }, { id: 51, name: 'Dugtrio', type: 'ground' },
  { id: 52, name: 'Meowth', type: 'normal' }, { id: 53, name: 'Persian', type: 'normal' },
  { id: 54, name: 'Psyduck', type: 'water' }, { id: 55, name: 'Golduck', type: 'water' },
  { id: 56, name: 'Mankey', type: 'fighting' }, { id: 57, name: 'Primeape', type: 'fighting' },
  { id: 58, name: 'Growlithe', type: 'fire' }, { id: 59, name: 'Arcanine', type: 'fire' },
  { id: 60, name: 'Poliwag', type: 'water' }, { id: 61, name: 'Poliwhirl', type: 'water' }, { id: 62, name: 'Poliwrath', type: 'water' },
  { id: 63, name: 'Abra', type: 'psychic' }, { id: 64, name: 'Kadabra', type: 'psychic' }, { id: 65, name: 'Alakazam', type: 'psychic' },
  { id: 66, name: 'Machop', type: 'fighting' }, { id: 67, name: 'Machoke', type: 'fighting' }, { id: 68, name: 'Machamp', type: 'fighting' },
  { id: 69, name: 'Bellsprout', type: 'grass' }, { id: 70, name: 'Weepinbell', type: 'grass' }, { id: 71, name: 'Victreebel', type: 'grass' },
  { id: 72, name: 'Tentacool', type: 'water' }, { id: 73, name: 'Tentacruel', type: 'water' },
  { id: 74, name: 'Geodude', type: 'rock' }, { id: 75, name: 'Graveler', type: 'rock' }, { id: 76, name: 'Golem', type: 'rock' },
  { id: 77, name: 'Ponyta', type: 'fire' }, { id: 78, name: 'Rapidash', type: 'fire' },
  { id: 79, name: 'Slowpoke', type: 'water' }, { id: 80, name: 'Slowbro', type: 'water' },
  { id: 81, name: 'Magnemite', type: 'electric' }, { id: 82, name: 'Magneton', type: 'electric' },
  { id: 83, name: 'Farfetch\'d', type: 'normal' },
  { id: 84, name: 'Doduo', type: 'normal' }, { id: 85, name: 'Dodrio', type: 'normal' },
  { id: 86, name: 'Seel', type: 'water' }, { id: 87, name: 'Dewgong', type: 'water' },
  { id: 88, name: 'Grimer', type: 'poison' }, { id: 89, name: 'Muk', type: 'poison' },
  { id: 90, name: 'Shellder', type: 'water' }, { id: 91, name: 'Cloyster', type: 'water' },
  { id: 92, name: 'Gastly', type: 'ghost' }, { id: 93, name: 'Haunter', type: 'ghost' }, { id: 94, name: 'Gengar', type: 'ghost' },
  { id: 95, name: 'Onix', type: 'rock' },
  { id: 96, name: 'Drowzee', type: 'psychic' }, { id: 97, name: 'Hypno', type: 'psychic' },
  { id: 98, name: 'Krabby', type: 'water' }, { id: 99, name: 'Kingler', type: 'water' },
  { id: 100, name: 'Voltorb', type: 'electric' }, { id: 101, name: 'Electrode', type: 'electric' },
  { id: 102, name: 'Exeggcute', type: 'grass' }, { id: 103, name: 'Exeggutor', type: 'grass' },
  { id: 104, name: 'Cubone', type: 'ground' }, { id: 105, name: 'Marowak', type: 'ground' },
  { id: 106, name: 'Hitmonlee', type: 'fighting' }, { id: 107, name: 'Hitmonchan', type: 'fighting' },
  { id: 108, name: 'Lickitung', type: 'normal' },
  { id: 109, name: 'Koffing', type: 'poison' }, { id: 110, name: 'Weezing', type: 'poison' },
  { id: 111, name: 'Rhyhorn', type: 'ground' }, { id: 112, name: 'Rhydon', type: 'ground' },
  { id: 113, name: 'Chansey', type: 'normal' },
  { id: 114, name: 'Tangela', type: 'grass' },
  { id: 115, name: 'Kangaskhan', type: 'normal' },
  { id: 116, name: 'Horsea', type: 'water' }, { id: 117, name: 'Seadra', type: 'water' },
  { id: 118, name: 'Goldeen', type: 'water' }, { id: 119, name: 'Seaking', type: 'water' },
  { id: 120, name: 'Staryu', type: 'water' }, { id: 121, name: 'Starmie', type: 'water' },
  { id: 122, name: 'Mr. Mime', type: 'psychic' },
  { id: 123, name: 'Scyther', type: 'bug' },
  { id: 124, name: 'Jynx', type: 'ice' },
  { id: 125, name: 'Electabuzz', type: 'electric' },
  { id: 126, name: 'Magmar', type: 'fire' },
  { id: 127, name: 'Pinsir', type: 'bug' },
  { id: 128, name: 'Tauros', type: 'normal' },
  { id: 129, name: 'Magikarp', type: 'water' }, { id: 130, name: 'Gyarados', type: 'water' },
  { id: 131, name: 'Lapras', type: 'water' },
  { id: 132, name: 'Ditto', type: 'normal' },
  { id: 133, name: 'Eevee', type: 'normal' }, { id: 134, name: 'Vaporeon', type: 'water' }, { id: 135, name: 'Jolteon', type: 'electric' }, { id: 136, name: 'Flareon', type: 'fire' },
  { id: 137, name: 'Porygon', type: 'normal' },
  { id: 138, name: 'Omanyte', type: 'rock' }, { id: 139, name: 'Omastar', type: 'rock' },
  { id: 140, name: 'Kabuto', type: 'rock' }, { id: 141, name: 'Kabutops', type: 'rock' },
  { id: 142, name: 'Aerodactyl', type: 'rock' },
  { id: 143, name: 'Snorlax', type: 'normal' },
  { id: 144, name: 'Articuno', type: 'ice' }, { id: 145, name: 'Zapdos', type: 'electric' }, { id: 146, name: 'Moltres', type: 'fire' },
  { id: 147, name: 'Dratini', type: 'dragon' }, { id: 148, name: 'Dragonair', type: 'dragon' }, { id: 149, name: 'Dragonite', type: 'dragon' },
  { id: 150, name: 'Mewtwo', type: 'psychic' }, { id: 151, name: 'Mew', type: 'psychic' },
];

// Questions needed to catch a Pokemon
const QUESTIONS_TO_CATCH = 10;

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
  type: string;
};

type GameState = 'menu' | 'playing' | 'correct' | 'newPokemon' | 'collection' | 'wiki';

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
  const [selectedWikiPokemon, setSelectedWikiPokemon] = useState<Pokemon | null>(null);
  
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
      
      if (newStreak > 0 && newStreak % QUESTIONS_TO_CATCH === 0) {
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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 safe-area-top safe-area-bottom">
        {/* Title */}
        <h1 className="text-4xl font-bold text-amber-800 mb-2">Math Quest!</h1>
        <p className="text-amber-600 mb-8">Catch Pokemon by solving math</p>
        
        {/* Pokemon showcase */}
        <div className="flex justify-center gap-4 mb-10">
          {[25, 4, 7, 1].map((id) => (
            <Image
              key={id}
              src={getSpriteUrl(id)}
              alt="Pokemon"
              width={56}
              height={56}
              unoptimized
            />
          ))}
        </div>
        
        {/* Main actions */}
        <div className="w-full max-w-xs space-y-3 mb-10">
          <button
            onClick={startGame}
            className="w-full h-14 bg-green-500 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            ▶ Play
          </button>
          
          <button
            onClick={() => setGameState('collection')}
            className="w-full h-12 bg-purple-500 text-white text-lg font-semibold rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            My Pokemon ({collectedPokemon.length}/{POKEMON_LIST.length})
          </button>
        </div>
        
        {/* Difficulty selector */}
        <div className="w-full max-w-xs mb-8">
          <p className="text-amber-700 font-semibold text-center mb-3">Difficulty</p>
          <div className="flex gap-2">
            {[
              { level: 1, label: 'Easy' },
              { level: 2, label: 'Medium' },
              { level: 3, label: 'Hard' },
            ].map(({ level, label }) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 h-12 rounded-xl font-semibold text-sm transition-all ${
                  difficulty === level
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white/80 text-amber-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-sm text-amber-600 text-center mt-2">
            {difficulty === 1 && 'Numbers 1-5'}
            {difficulty === 2 && 'Numbers 1-10'}
            {difficulty === 3 && 'Numbers 1-20'}
          </p>
        </div>
        
        {/* Score */}
        {score > 0 && (
          <p className="text-amber-700 font-semibold">⭐ {score} stars</p>
        )}
      </div>
    );
  }

  // Collection Screen
  if (gameState === 'collection') {
    return (
      <div className="min-h-screen flex flex-col safe-area-top safe-area-bottom">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setGameState('menu')}
            className="w-12 h-12 flex items-center justify-center bg-white/80 rounded-full text-amber-800 font-bold text-xl shadow-md active:scale-95"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-amber-800">Pokédex</h2>
          <div className="w-12" />
        </div>
        
        {/* Pokemon grid */}
        <div className="flex-1 px-4 overflow-auto pb-4">
          <div className="grid grid-cols-4 gap-2">
            {POKEMON_LIST.map((pokemon) => {
              const collected = collectedPokemon.some(p => p.id === pokemon.id);
              return (
                <button
                  key={pokemon.id}
                  onClick={() => {
                    if (collected) {
                      setSelectedWikiPokemon(pokemon);
                      setGameState('wiki');
                    }
                  }}
                  disabled={!collected}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all ${
                    collected ? 'bg-white shadow-md active:scale-95' : 'bg-white/30'
                  }`}
                >
                  <Image
                    src={getSpriteUrl(pokemon.id)}
                    alt={collected ? pokemon.name : '???'}
                    width={48}
                    height={48}
                    className={collected ? '' : 'opacity-20 grayscale'}
                    unoptimized
                  />
                  <span className={`text-[10px] font-medium ${collected ? 'text-gray-600' : 'text-gray-400'}`}>
                    #{pokemon.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 text-center border-t border-amber-200/50">
          <p className="text-amber-700 font-semibold">
            {collectedPokemon.length} / {POKEMON_LIST.length} caught
          </p>
        </div>
      </div>
    );
  }

  // Wiki/Detail Screen
  if (gameState === 'wiki' && selectedWikiPokemon) {
    const pokemon = selectedWikiPokemon;
    const typeColor = TYPE_COLORS[pokemon.type] || '#A8A878';
    return (
      <div className="min-h-screen flex flex-col safe-area-top safe-area-bottom">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setGameState('collection')}
            className="w-12 h-12 flex items-center justify-center bg-white/80 rounded-full text-amber-800 font-bold text-xl shadow-md active:scale-95"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-amber-800">#{pokemon.id}</h2>
          <div className="w-12" />
        </div>
        
        {/* Pokemon details */}
        <div className="flex-1 flex flex-col items-center px-6 py-4">
          {/* Sprite with type-colored background */}
          <div 
            className="w-40 h-40 rounded-full flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: typeColor }}
          >
            <Image
              src={getSpriteUrl(pokemon.id)}
              alt={pokemon.name}
              width={120}
              height={120}
              unoptimized
            />
          </div>
          
          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{pokemon.name}</h1>
          
          {/* Type badge */}
          <div 
            className="px-4 py-1 rounded-full text-white font-semibold text-sm mb-6 capitalize"
            style={{ backgroundColor: typeColor }}
          >
            {pokemon.type}
          </div>
          
          {/* Stats card */}
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-md p-4 mb-4">
            <h3 className="font-bold text-gray-700 mb-3">Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">National #</span>
                <span className="font-semibold">{pokemon.id.toString().padStart(3, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-semibold capitalize">{pokemon.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Generation</span>
                <span className="font-semibold">I (Kanto)</span>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex gap-3 w-full max-w-xs">
            {pokemon.id > 1 && (
              <button
                onClick={() => {
                  const prev = POKEMON_LIST.find(p => p.id === pokemon.id - 1);
                  if (prev && collectedPokemon.some(p => p.id === prev.id)) {
                    setSelectedWikiPokemon(prev);
                  }
                }}
                className="flex-1 h-12 bg-white/80 rounded-xl font-semibold text-amber-700 shadow-md active:scale-95"
              >
                ← Prev
              </button>
            )}
            {pokemon.id < 151 && (
              <button
                onClick={() => {
                  const next = POKEMON_LIST.find(p => p.id === pokemon.id + 1);
                  if (next && collectedPokemon.some(p => p.id === next.id)) {
                    setSelectedWikiPokemon(next);
                  }
                }}
                className="flex-1 h-12 bg-white/80 rounded-xl font-semibold text-amber-700 shadow-md active:scale-95"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // New Pokemon Screen
  if (gameState === 'newPokemon' && newPokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 safe-area-top safe-area-bottom">
        {/* Celebration header */}
        <p className="text-2xl font-bold text-amber-700 mb-8">⭐ New Pokemon! ⭐</p>
        
        {/* Pokemon showcase - centered circle with sprite */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl animate-celebrate"
          style={{ backgroundColor: TYPE_COLORS[newPokemon.type] || '#A8A878' }}
        >
          <Image
            src={getSpriteUrl(newPokemon.id)}
            alt={newPokemon.name}
            width={80}
            height={80}
            className="drop-shadow-md"
            unoptimized
          />
        </div>
        
        {/* Pokemon name */}
        <h2 className="text-3xl font-bold text-gray-800 mb-1">{newPokemon.name}</h2>
        <p className="text-lg text-amber-600 mb-10">joined your team!</p>
        
        {/* Continue button - large touch target */}
        <button
          onClick={continueAfterPokemon}
          className="w-full max-w-xs h-14 bg-gradient-to-r from-green-400 to-green-500 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Keep Playing! 🚀
        </button>
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
  const progressPercent = ((streak % QUESTIONS_TO_CATCH) / QUESTIONS_TO_CATCH) * 100;
  const streakSize = Math.min(24 + streak * 2, 40); // Grows with streak, max 40px

  return (
    <div className="min-h-screen flex flex-col safe-area-top safe-area-bottom">
      {/* Header - compact, clean */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setGameState('menu')}
          className="w-12 h-12 flex items-center justify-center bg-white/80 rounded-full text-amber-800 font-bold text-xl shadow-md active:scale-95"
        >
          ←
        </button>
        
        {/* Stats - right aligned */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/80 px-3 py-2 rounded-full shadow-md relative">
            <StarIcon size={20} />
            <span className="text-lg font-bold text-amber-800">{score}</span>
            {showScorePop && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-green-500 font-bold animate-score-pop">
                +{earnedPoints}
              </span>
            )}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-100 px-3 py-2 rounded-full shadow-md">
              <FireIcon size={20} />
              <span className="text-lg font-bold text-orange-600">{streak}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress to next Pokemon - centered */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-center gap-3">
          {nextPokemon ? (
            <>
              <span className="text-sm font-semibold text-amber-700">
                {streak % QUESTIONS_TO_CATCH}/{QUESTIONS_TO_CATCH}
              </span>
              <div className="w-32 h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <Image
                src={getSpriteUrl(nextPokemon.id)}
                alt="Next Pokemon"
                width={32}
                height={32}
                className="opacity-40"
                unoptimized
              />
            </>
          ) : (
            <span className="text-amber-700 font-medium">All 151 caught! 🏆</span>
          )}
        </div>
      </div>
      
      {/* Main game area - centered */}
      {problem && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          {/* Problem card */}
          <div className={`w-full max-w-xs bg-white rounded-3xl shadow-xl p-6 mb-6 ${isWrong ? 'animate-wiggle bg-red-50' : ''} ${gameState === 'correct' ? 'bg-green-50' : ''}`}>
            <p className="text-5xl font-bold text-center text-gray-800">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </p>
          </div>
          
          {/* Answer grid - 2x2, large touch targets */}
          <div className="w-full max-w-xs grid grid-cols-2 gap-3 mb-6">
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
                  className={`h-20 text-3xl font-bold rounded-2xl shadow-md transition-all ${
                    showCorrect
                      ? 'bg-green-400 text-white'
                      : showWrong
                      ? 'bg-red-400 text-white'
                      : `${buttonColors[i]} text-gray-700 active:scale-95`
                  } ${isCorrectPop ? 'animate-correct-pop' : ''}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          
          {/* Feedback area */}
          <div className="h-16 flex items-center justify-center">
            {gameState === 'correct' ? (
              <p className="text-xl font-bold text-green-600 animate-pop">
                ⭐ Great job! ⭐
              </p>
            ) : (
              <p className="text-amber-600 font-medium">{encouragement}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
