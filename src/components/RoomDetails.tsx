
import React, { useMemo } from 'react';
import { BingoRoom } from '../types';
import { generateBingoTicket } from '../lib/bingoUtils';
import BingoTicketCard from './BingoTicketCard';
import { Users, Clock, Trophy, Ticket, Star } from 'lucide-react';

interface RoomDetailsProps {
  room: BingoRoom;
  onBuyTickets: () => void;
}

const formatPrice = (price: number): string =>
  price < 1 ? `${Math.round(price * 100)}p` : `£${price.toFixed(2)}`;

const formatPot = (pot: number): string =>
  pot >= 1000 ? `£${(pot / 1000).toFixed(0)},000` : `£${pot}`;

const getTimeUntil = (isoString: string): string => {
  const diffMs = new Date(isoString).getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins <= 0) return 'Starting soon';
  if (diffMins < 60) return `${diffMins} mins`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};

const statusLabel: Record<BingoRoom['status'], string> = {
  open: 'Open',
  filling: 'Filling fast',
  starting: 'Starting soon',
};

const statusColour: Record<BingoRoom['status'], string> = {
  open: 'bg-green-100 text-green-700',
  filling: 'bg-amber-100 text-amber-700',
  starting: 'bg-red-100 text-red-700',
};

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, onBuyTickets }) => {
  const sampleTicket = useMemo(() => generateBingoTicket(0), [room.id]);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-bingo-purple to-bingo-pink text-white p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-4xl font-bold font-serif tracking-tight">{room.name}</h2>
              {room.isFeatured && (
                <span className="flex items-center gap-1 bg-bingo-yellow text-bingo-dark text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>
            <p className="text-purple-200 text-sm">90-Ball Bingo</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColour[room.status]}`}>
            {statusLabel[room.status]}
          </span>
        </div>

        {/* Prize pot */}
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-8 w-8 text-bingo-yellow" />
          <div>
            <p className="text-purple-200 text-xs uppercase tracking-wide">Prize Pot</p>
            <p className="text-3xl font-bold text-bingo-yellow">{formatPot(room.prizePot)}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Ticket className="h-5 w-5 mx-auto mb-1 text-purple-200" />
            <p className="text-lg font-bold">{formatPrice(room.ticketPrice)}</p>
            <p className="text-xs text-purple-200">per ticket</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-purple-200" />
            <p className="text-lg font-bold">{room.playerCount}</p>
            <p className="text-xs text-purple-200">players</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-purple-200" />
            <p className="text-lg font-bold">{getTimeUntil(room.nextGameTime)}</p>
            <p className="text-xs text-purple-200">until next game</p>
          </div>
        </div>
      </div>

      {/* Sample ticket + win conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample ticket */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-bingo-dark mb-1">What a ticket looks like</h3>
          <p className="text-sm text-gray-500 mb-4">3 rows × 9 columns — 15 numbers per ticket</p>
          <BingoTicketCard grid={sampleTicket.grid} size="md" />
        </div>

        {/* Win conditions */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-bingo-dark mb-4">Win conditions</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-bingo-light rounded-xl">
              <span className="text-2xl">🥉</span>
              <div>
                <p className="font-bold text-bingo-dark">1 Line</p>
                <p className="text-sm text-gray-500">Complete any one row</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-bingo-light rounded-xl">
              <span className="text-2xl">🥈</span>
              <div>
                <p className="font-bold text-bingo-dark">2 Lines</p>
                <p className="text-sm text-gray-500">Complete any two rows</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-bingo-lavender to-bingo-light rounded-xl border border-purple-200">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-bold text-bingo-dark">Full House</p>
                <p className="text-sm text-gray-500">Complete all three rows — win the pot!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pb-4">
        <button
          onClick={onBuyTickets}
          className="bg-bingo-pink hover:bg-pink-600 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-lg transition-all hover:scale-105 active:scale-100"
        >
          Buy Tickets →
        </button>
        <p className="text-sm text-gray-500 mt-2">Up to 6 tickets per game</p>
      </div>
    </div>
  );
};

export default RoomDetails;
