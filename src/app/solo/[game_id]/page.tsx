'use client'

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Trophy } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

type GameState = 'home' | 'countdown' | 'playing' | 'results';
type ArrowKey = 'up' | 'down' | 'left' | 'right';

interface GameStats {
  totalKeys: number;
  correctKeys: number;
  timeTaken: number;
  accuracy: number;
}

const ARROW_ICONS = {
  up: ArrowUp,
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
} as const;

const ARROW_KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
} as const;

const GamePage = () => {
  const params = useParams();
  const gameId = params.game_id;
  const router = useRouter();

  const [countdown, setCountdown] = useState(3);
  const [gameState, setGameState] = useState<GameState>();
  const [startTime, setStartTime] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sequence, setSequence] = useState<ArrowKey[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | ''>('');
  const [pressedKey, setPressedKey] = useState<string>('');
  const [gameStats, setGameStats] = useState<GameStats>({
    totalKeys: 0,
    correctKeys: 0,
    timeTaken: 0,
    accuracy: 0,
  });

  const generateSequence = (length: number = 20): ArrowKey[] => {
    const keys: ArrowKey[] = ['up', 'down', 'left', 'right'];
    return Array.from({ length }, () => keys[Math.floor(Math.random() * keys.length)]);
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    const key = ARROW_KEYS[event.key as keyof typeof ARROW_KEYS];
    if (!key) return;

    setPressedKey(event.key);
    const currentKey = sequence[currentIndex];
    const isCorrect = key === currentKey;

    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback('');
      setPressedKey('');
    }, 200);

    const newStats = {
      totalKeys: gameStats.totalKeys + 1,
      correctKeys: gameStats.correctKeys + (isCorrect ? 1 : 0),
      timeTaken: 0,
      accuracy: 0,
    };

    if (currentIndex >= sequence.length - 1) {
      // Game finished
      const timeTaken = (Date.now() - startTime) / 1000;
      newStats.timeTaken = timeTaken;
      newStats.accuracy = (newStats.correctKeys / newStats.totalKeys) * 100;
      setGameStats(newStats);
      setGameState('results');
    } else {
      setCurrentIndex(currentIndex + 1);
      setGameStats(newStats);
    }
  }, [gameState, sequence, currentIndex, gameStats, startTime]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const startGame = async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_BUILD_SHIP_BACKEND_URL + '/solo-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: '123',
          game_id: gameId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start game');
      }

      const data = await response.json();

      if (data[0] && data[0].status === 'not_started') {
        setGameState('countdown');
        setSequence(generateSequence());
        setCurrentIndex(0);
        setGameStats({ totalKeys: 0, correctKeys: 0, timeTaken: 0, accuracy: 0 });
        setCountdown(3);

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setGameState('playing');
              setStartTime(Date.now());
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (data[0] && data[0].status === 'completed') {
        setGameState('results');
        setGameStats({
          totalKeys: 20,
          correctKeys: data[0].score,
          timeTaken: data[0].time,
          accuracy: data[0].accuracy,
        });
      }
    };

    startGame();
  }, [gameId])

  useEffect(() => {
    const saveResult = async () => {
      await fetch(process.env.NEXT_PUBLIC_BUILD_SHIP_BACKEND_URL + '/end-solo-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: '123',
          game_id: gameId,
          time: gameStats.timeTaken,
          accuracy: gameStats.accuracy,
        }),
      })
    }

    if (gameState === 'results') {
      saveResult();
    }
  }, [gameState, gameId])

  const ArrowKeyIcon = ({ arrow, isActive, isNext }: { arrow: ArrowKey; isActive: boolean; isNext: boolean }) => {
    const Icon = ARROW_ICONS[arrow];
    return (
      <div className={`
        w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-200
        ${isActive ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50 scale-110' :
          isNext ? 'border-pink-400 bg-pink-400/10 shadow-md shadow-pink-400/30' :
            'border-gray-600 bg-gray-800/50'}
      `}>
        <Icon className={`w-8 h-8 ${isActive ? 'text-cyan-400' : isNext ? 'text-pink-400' : 'text-gray-400'}`} />
      </div>
    );
  };

  const KeyboardKey = ({ keyName, isPressed }: { keyName: string; isPressed: boolean }) => {
    const getKeyIcon = () => {
      switch (keyName) {
        case 'ArrowUp': return <ArrowUp className="w-4 h-4" />;
        case 'ArrowDown': return <ArrowDown className="w-4 h-4" />;
        case 'ArrowLeft': return <ArrowLeft className="w-4 h-4" />;
        case 'ArrowRight': return <ArrowRight className="w-4 h-4" />;
        default: return keyName;
      }
    };

    return (
      <div className={`
        w-12 h-12 rounded border-2 flex items-center justify-center transition-all duration-100
        ${isPressed ?
          (feedback === 'correct' ? 'border-green-400 bg-green-400/30 shadow-lg shadow-green-400/50' :
            feedback === 'wrong' ? 'border-red-400 bg-red-400/30 shadow-lg shadow-red-400/50' :
              'border-cyan-400 bg-cyan-400/20') :
          'border-gray-600 bg-gray-800'}
      `}>
        <span className={`text-sm ${isPressed ? 'text-white' : 'text-gray-400'}`}>
          {getKeyIcon()}
        </span>
      </div>
    );
  };

  if (gameState === 'countdown') {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="font-bold text-transparent text-9xl bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 countdown-pulse">
            {countdown || 'GO!'}
          </div>
          <p className="mt-4 text-2xl text-gray-300">Get Ready...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const progress = (currentIndex / sequence.length) * 100;
    const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    return (
      <div className="w-screen min-h-screen p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-cyan-400">TIME: {timeElapsed}s</div>
            <div className="text-xl font-bold text-pink-400">
              {currentIndex + 1}/{sequence.length}
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-gray-800 neon-progress" />
        </div>

        {/* Arrow Sequence */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {sequence.slice(Math.max(0, currentIndex - 2), currentIndex + 8).map((arrow, idx) => {
              const actualIndex = Math.max(0, currentIndex - 2) + idx;
              return (
                <ArrowKeyIcon
                  key={actualIndex}
                  arrow={arrow}
                  isActive={actualIndex === currentIndex}
                  isNext={actualIndex === currentIndex + 1}
                />
              );
            })}
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="max-w-md mx-auto">
          <p className="mb-4 text-center text-gray-400">Press the corresponding arrow key</p>
          <div className="flex justify-center gap-2">
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <KeyboardKey keyName="ArrowUp" isPressed={pressedKey === 'ArrowUp'} />
              <div></div>
              <KeyboardKey keyName="ArrowLeft" isPressed={pressedKey === 'ArrowLeft'} />
              <KeyboardKey keyName="ArrowDown" isPressed={pressedKey === 'ArrowDown'} />
              <KeyboardKey keyName="ArrowRight" isPressed={pressedKey === 'ArrowRight'} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const isWin = gameStats.accuracy >= 80;

    return (
      <div className="flex items-center justify-center w-screen min-h-screen p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className={`text-6xl font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
              {isWin ? <Trophy className="w-16 h-16 mx-auto mb-2" /> : '💥'}
            </div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              {isWin ? 'EXCELLENT!' : 'TRY AGAIN!'}
            </h2>
          </div>

          <div className="p-6 space-y-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div>
                <div className="text-gray-400">Time</div>
                <div className="font-bold text-cyan-400">{gameStats.timeTaken}s</div>
              </div>
              <div>
                <div className="text-gray-400">Accuracy</div>
                <div className="font-bold text-pink-400">{gameStats.accuracy.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-400">Correct</div>
                <div className="font-bold text-green-400">{gameStats.correctKeys}</div>
              </div>
              <div>
                <div className="text-gray-400">Total</div>
                <div className="font-bold text-purple-400">{gameStats.totalKeys}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/')}
              className="h-12 text-lg font-bold shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/25"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              PLAY AGAIN
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen min-h-screen p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    </div>
  )
}

export default GamePage