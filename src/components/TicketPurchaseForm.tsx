
import React, { useState } from 'react';
import { BingoRoom, BingoTicket, TicketPurchase } from '../types';
import { generateTickets } from '../lib/bingoUtils';
import {
  trackTicketQuantityChanged,
  trackTicketPurchase,
  trackPurchaseAbandoned,
} from '../lib/tracking';
import BingoTicketCard from './BingoTicketCard';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import { Minus, Plus, ArrowLeft } from 'lucide-react';

interface TicketPurchaseFormProps {
  room: BingoRoom;
  onConfirmPurchase: (purchase: TicketPurchase) => void;
  onCancel: () => void;
  onQuantityChange?: (qty: number) => void;
}

const formatPrice = (price: number): string =>
  price < 1 ? `${Math.round(price * 100)}p` : `£${price.toFixed(2)}`;

const TicketPurchaseForm: React.FC<TicketPurchaseFormProps> = ({
  room,
  onConfirmPurchase,
  onCancel,
  onQuantityChange,
}) => {
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tickets, setTickets] = useState<BingoTicket[]>(() => generateTickets(1));

  const totalCost = quantity * room.ticketPrice;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > 6) return;
    trackTicketQuantityChanged(room, quantity, newQty);
    setQuantity(newQty);
    setTickets(generateTickets(newQty));
    onQuantityChange?.(newQty);
  };

  // Fires purchase_abandoned then hands back to parent
  const handleAbandon = () => {
    trackPurchaseAbandoned(room, quantity);
    onCancel();
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    trackTicketPurchase(room, quantity, totalCost, e.clientX, e.clientY);

    const purchase: TicketPurchase = {
      id: Date.now(),
      roomId: room.id,
      roomName: room.name,
      ticketPrice: room.ticketPrice,
      ticketCount: quantity,
      totalCost,
      tickets,
    };

    onConfirmPurchase(purchase);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAbandon}
          className="text-bingo-purple hover:text-bingo-dark flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-bingo-dark font-serif">{room.name}</h2>
          <p className="text-sm text-gray-500">{formatPrice(room.ticketPrice)} per ticket</p>
        </div>
      </div>

      {/* Quantity selector */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-bold text-bingo-dark mb-4">How many tickets?</h3>
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="h-12 w-12 rounded-full bg-bingo-lavender hover:bg-bingo-purple hover:text-white text-bingo-purple font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Minus className="h-5 w-5" />
          </button>
          <div className="text-center">
            <span className="text-5xl font-bold text-bingo-dark">{quantity}</span>
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 6}
            className="h-12 w-12 rounded-full bg-bingo-lavender hover:bg-bingo-purple hover:text-white text-bingo-purple font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="h-5 w-5" />
          </button>
          <div className="ml-4 bg-bingo-light rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-0.5">Total cost</p>
            <p className="text-2xl font-bold text-bingo-purple">{formatPrice(totalCost)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Maximum 6 tickets per game</p>
      </div>

      {/* Ticket previews */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-bold text-bingo-dark mb-4">
          Your {quantity === 1 ? 'ticket' : `${quantity} tickets`}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket, idx) => (
            <BingoTicketCard
              key={ticket.id}
              grid={ticket.grid}
              title={`Ticket ${idx + 1}`}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pb-4">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-bingo-pink hover:bg-pink-600 text-white font-bold py-4 rounded-2xl text-lg shadow transition-all hover:scale-[1.02] active:scale-100"
        >
          Confirm Purchase — {formatPrice(totalCost)}
        </button>
        <button
          onClick={handleAbandon}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-colors"
        >
          Cancel
        </button>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        room={room}
      />
    </div>
  );
};

export default TicketPurchaseForm;
