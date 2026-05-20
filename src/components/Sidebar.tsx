
import React, { useState, useEffect, useRef } from 'react';
import { BingoRoom } from '../types';
import { rooms } from '../data/rooms';
import { Users, Clock, Trophy, Star } from 'lucide-react';

interface SidebarProps {
  onSelectRoom: (room: BingoRoom) => void;
  selectedRoomId: number | null;
}

const formatPrice = (price: number): string =>
  price < 1 ? `${Math.round(price * 100)}p` : `£${price.toFixed(2)}`;

const formatPot = (pot: number): string =>
  pot >= 1000 ? `£${(pot / 1000).toFixed(0)}k` : `£${pot}`;

const getTimeUntil = (isoString: string): string => {
  const diffMs = new Date(isoString).getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins <= 0) return 'Starting soon';
  if (diffMins < 60) return `${diffMins}m`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};

const Sidebar: React.FC<SidebarProps> = ({ onSelectRoom, selectedRoomId }) => {
  const [playerCounts, setPlayerCounts] = useState<Record<number, number>>(
    Object.fromEntries(rooms.map(r => [r.id, r.playerCount]))
  );
  const [gameTimes, setGameTimes] = useState<Record<number, string>>(
    Object.fromEntries(rooms.map(r => [r.id, r.nextGameTime]))
  );
  const tickRef = useRef(0);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      forceRender(n => n + 1);

      // Drift player counts every 3 seconds
      if (tickRef.current % 3 === 0) {
        setPlayerCounts(prev => {
          const next = { ...prev };
          rooms.forEach(r => {
            const delta = Math.random() < 0.5 ? 1 : -1;
            next[r.id] = Math.max(5, next[r.id] + delta);
          });
          return next;
        });
      }

      // Reset expired countdowns to 30 min
      setGameTimes(prev => {
        let changed = false;
        const next = { ...prev };
        rooms.forEach(r => {
          if (new Date(next[r.id]).getTime() <= Date.now()) {
            next[r.id] = new Date(Date.now() + 30 * 60000).toISOString();
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="bg-bingo-dark text-white w-64 flex-shrink-0 h-screen overflow-y-auto sidebar-scrollbar">
      <div className="p-4 border-b border-purple-800">
        <h2 className="text-lg font-bold text-purple-200 font-serif">Bingo Rooms</h2>
      </div>
      <div>
        {rooms.map(room => (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`p-4 border-b border-purple-800 cursor-pointer transition-colors hover:bg-purple-900/50 ${
              selectedRoomId === room.id ? 'bg-bingo-purple/30 border-l-4 border-l-bingo-pink' : ''
            }`}
          >
            {/* Room name + featured badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm">{room.name}</span>
              {room.isFeatured && (
                <span className="flex items-center gap-1 bg-bingo-yellow text-bingo-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <Star className="h-2.5 w-2.5" />
                  Hot
                </span>
              )}
            </div>

            {/* Ticket price + prize pot */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-bingo-pink font-bold text-sm">
                {formatPrice(room.ticketPrice)} / ticket
              </span>
              <span className="flex items-center gap-1 text-bingo-yellow text-xs font-semibold">
                <Trophy className="h-3 w-3" />
                {formatPot(room.prizePot)}
              </span>
            </div>

            {/* Players + countdown */}
            <div className="flex items-center justify-between text-xs text-purple-300">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {playerCounts[room.id]} playing
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getTimeUntil(gameTimes[room.id])}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
