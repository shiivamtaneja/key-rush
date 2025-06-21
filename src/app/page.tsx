'use client'

import { Button } from '@/components/ui/button';
import { Trophy, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';

const HomePage = () => {
  const router = useRouter();

  const startGame = () => {
    toast.promise(
      (async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BUILD_SHIP_BACKEND_URL + '/start-solo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            player_id: '123',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to start game');
        }

        const data = await response.json();
        const gameId = data[0].id;

        router.push(`/solo/${gameId}`);
        return data;
      })(),
      {
        error: 'Error starting game',
        pending: 'Starting game...',
        success: 'Game started!',
      }
    );
  };


  return (
    <div className="flex items-center justify-center w-screen min-h-screen p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="font-bold tracking-wider text-transparent text-8xl bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 retro-text">
            KEYRUSH
          </h1>
          <p className="text-xl tracking-wide text-gray-300">
            Test your reflexes in this high-speed reaction game
          </p>
        </div>

        <div className="flex flex-col max-w-sm gap-4 mx-auto">
          <Button
            onClick={startGame}
            className="text-lg font-bold border shadow-lg h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/25 border-cyan-400/50 neon-button"
          >
            <Zap className="w-5 h-5 mr-2" />
            PLAY SOLO
          </Button>

          <Button
            disabled
            className="text-lg font-bold opacity-50 cursor-not-allowed h-14 bg-gradient-to-r from-pink-500 to-purple-500"
          >
            MULTIPLAYER MATCH
            <span className="ml-2 text-xs">(Coming Soon)</span>
          </Button>

          <Button
            onClick={() => router.push('/leaderboard')}
            className="text-lg font-bold border shadow-lg h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/25 border-cyan-400/50 neon-button"
          >
            <Trophy className="w-5 h-5 mr-2" />
            LEADERBOARD
          </Button>
        </div>

        <div className="space-y-2 text-sm text-gray-400">
          <p>Use arrow keys: ↑ ↓ ← →</p>
          <p>Match the sequence as fast as you can!</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage