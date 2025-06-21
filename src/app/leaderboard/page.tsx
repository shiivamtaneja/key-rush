'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ArrowLeft, Crown, Medal, Trophy, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

// Mock leaderboard data
const mockLeaderboardData = [
  {
    rank: 1,
    player: "CyberNinja",
    score: 12500,
    time: "00:45.23",
    accuracy: "98.5%",
    level: 15,
    isCurrentUser: false
  },
  {
    rank: 2,
    player: "NeonRunner",
    score: 11800,
    time: "00:48.12",
    accuracy: "97.2%",
    level: 14,
    isCurrentUser: false
  },
  {
    rank: 3,
    player: "PixelMaster",
    score: 11200,
    time: "00:50.45",
    accuracy: "96.8%",
    level: 13,
    isCurrentUser: false
  },
  {
    rank: 4,
    player: "RetroGamer",
    score: 10500,
    time: "00:52.18",
    accuracy: "95.1%",
    level: 12,
    isCurrentUser: false
  },
  {
    rank: 5,
    player: "SpeedDemon",
    score: 9800,
    time: "00:55.33",
    accuracy: "94.3%",
    level: 11,
    isCurrentUser: false
  },
  {
    rank: 6,
    player: "KeyMaster",
    score: 9200,
    time: "00:58.07",
    accuracy: "93.7%",
    level: 10,
    isCurrentUser: true
  },
  {
    rank: 7,
    player: "GlitchHunter",
    score: 8700,
    time: "01:01.24",
    accuracy: "92.9%",
    level: 9,
    isCurrentUser: false
  },
  {
    rank: 8,
    player: "ByteBuster",
    score: 8200,
    time: "01:04.56",
    accuracy: "91.8%",
    level: 8,
    isCurrentUser: false
  },
  {
    rank: 9,
    player: "CodeCrusher",
    score: 7800,
    time: "01:07.12",
    accuracy: "90.5%",
    level: 7,
    isCurrentUser: false
  },
  {
    rank: 10,
    player: "MatrixRunner",
    score: 7400,
    time: "01:10.33",
    accuracy: "89.2%",
    level: 6,
    isCurrentUser: false
  }
]

const LeaderboardPage = () => {
  const router = useRouter()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-800 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              className="text-gray-300 hover:text-white mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 retro-text">
              LEADERBOARD
            </h1>
          </div>
          <p className="text-xl text-gray-300 tracking-wide">
            Top players in the cyber realm
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">10</div>
            <div className="text-gray-300">Total Players</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-pink-400/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">12,500</div>
            <div className="text-gray-300">Highest Score</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">00:45</div>
            <div className="text-gray-300">Best Time</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-black/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-400/30 hover:bg-cyan-400/10">
                <TableHead className="text-cyan-400 font-bold text-center">Rank</TableHead>
                <TableHead className="text-cyan-400 font-bold">Player</TableHead>
                <TableHead className="text-cyan-400 font-bold text-center">Score</TableHead>
                <TableHead className="text-cyan-400 font-bold text-center">Time</TableHead>
                <TableHead className="text-cyan-400 font-bold text-center">Accuracy</TableHead>
                <TableHead className="text-cyan-400 font-bold text-center">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaderboardData.map((player) => (
                <TableRow 
                  key={player.rank}
                  className={`border-cyan-400/20 hover:bg-cyan-400/10 transition-all duration-200 ${
                    player.isCurrentUser 
                      ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 border-l-4 border-l-cyan-400' 
                      : ''
                  }`}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {getRankIcon(player.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadge(player.rank)}`}>
                        {player.rank}
                      </div>
                      <span className={`font-semibold ${player.isCurrentUser ? 'text-cyan-400' : 'text-white'}`}>
                        {player.player}
                        {player.isCurrentUser && <span className="ml-2 text-xs text-cyan-400">(You)</span>}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-green-400">{player.score.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-yellow-400">{player.time}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-purple-400">{player.accuracy}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-bold text-white">{player.level}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button
            onClick={() => router.push('/')}
            className="text-lg font-bold border shadow-lg px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-cyan-500/25 border-cyan-400/50 neon-button"
          >
            <Zap className="w-5 h-5 mr-2" />
            PLAY AGAIN
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Updated every 30 seconds • Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage