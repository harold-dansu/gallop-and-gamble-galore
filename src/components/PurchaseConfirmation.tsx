
import React from 'react';
import { TicketPurchase } from '../types';
import BingoTicketCard from './BingoTicketCard';
import { CheckCircle } from 'lucide-react';

interface PurchaseConfirmationProps {
  purchase: TicketPurchase;
  onBackToLobby: () => void;
}

const formatPrice = (price: number): string =>
  price < 1 ? `${Math.round(price * 100)}p` : `£${price.toFixed(2)}`;

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  purchase,
  onBackToLobby,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success header */}
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-bingo-dark font-serif mb-1">Tickets Confirmed!</h2>
        <p className="text-gray-500">Good luck — your tickets are ready for the next game</p>
      </div>

      {/* Purchase summary */}
      <div className="bg-bingo-lavender rounded-2xl p-6">
        <h3 className="font-bold text-bingo-dark text-lg mb-4">Purchase Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Room</span>
            <span className="font-semibold text-bingo-dark">{purchase.roomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tickets</span>
            <span className="font-semibold text-bingo-dark">{purchase.ticketCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per ticket</span>
            <span className="font-semibold text-bingo-dark">{formatPrice(purchase.ticketPrice)}</span>
          </div>
          <div className="border-t border-purple-300 pt-2 flex justify-between text-base">
            <span className="font-bold text-bingo-dark">Total paid</span>
            <span className="font-bold text-bingo-purple">{formatPrice(purchase.totalCost)}</span>
          </div>
        </div>
      </div>

      {/* Purchased tickets */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-bold text-bingo-dark text-lg mb-4">Your Tickets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchase.tickets.map((ticket, idx) => (
            <BingoTicketCard
              key={ticket.id}
              grid={ticket.grid}
              title={`Ticket ${idx + 1}`}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="text-center pb-4">
        <button
          onClick={onBackToLobby}
          className="bg-bingo-purple hover:bg-bingo-dark text-white font-bold py-3 px-10 rounded-2xl transition-all hover:scale-105 active:scale-100"
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
};

export default PurchaseConfirmation;
