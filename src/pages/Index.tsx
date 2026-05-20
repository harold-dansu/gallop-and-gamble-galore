
import React, { useState, useEffect } from 'react';
import { BingoRoom, TicketPurchase } from '../types';
import { getAllRooms } from '../data/rooms';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import RoomDetails from '../components/RoomDetails';
import TicketPurchaseForm from '../components/TicketPurchaseForm';
import PurchaseConfirmation from '../components/PurchaseConfirmation';
import { trackRoomViewed, trackPurchaseAbandoned, trackScreenView } from '../lib/tracking';

enum AppState {
  VIEWING_LOBBY,
  SELECTING_TICKETS,
  PURCHASE_CONFIRMED,
}

const SCREEN_NAMES: Record<AppState, 'VIEWING_LOBBY' | 'SELECTING_TICKETS' | 'PURCHASE_CONFIRMED'> = {
  [AppState.VIEWING_LOBBY]: 'VIEWING_LOBBY',
  [AppState.SELECTING_TICKETS]: 'SELECTING_TICKETS',
  [AppState.PURCHASE_CONFIRMED]: 'PURCHASE_CONFIRMED',
};

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<BingoRoom | null>(getAllRooms()[0]);
  const [purchase, setPurchase] = useState<TicketPurchase | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.VIEWING_LOBBY);
  // Kept in sync with TicketPurchaseForm so purchase_abandoned has the right count
  const [currentTicketCount, setCurrentTicketCount] = useState(1);

  // Screen view on every state or room change
  useEffect(() => {
    trackScreenView(SCREEN_NAMES[appState], selectedRoom);
  }, [appState, selectedRoom]);

  const handleSelectRoom = (room: BingoRoom) => {
    // User switched rooms mid-purchase — fire abandonment before resetting state
    if (appState === AppState.SELECTING_TICKETS && selectedRoom) {
      trackPurchaseAbandoned(selectedRoom, currentTicketCount);
    }
    setSelectedRoom(room);
    setAppState(AppState.VIEWING_LOBBY);
    trackRoomViewed(room);
  };

  const handleBuyTickets = () => {
    setCurrentTicketCount(1);
    setAppState(AppState.SELECTING_TICKETS);
  };

  const handleConfirmPurchase = (p: TicketPurchase) => {
    setPurchase(p);
    setAppState(AppState.PURCHASE_CONFIRMED);
  };

  const handleCancelPurchase = () => {
    setAppState(AppState.VIEWING_LOBBY);
  };

  const handleBackToLobby = () => {
    setPurchase(null);
    setAppState(AppState.VIEWING_LOBBY);
  };

  const renderMainContent = () => {
    switch (appState) {
      case AppState.SELECTING_TICKETS:
        return selectedRoom ? (
          <TicketPurchaseForm
            room={selectedRoom}
            onConfirmPurchase={handleConfirmPurchase}
            onCancel={handleCancelPurchase}
            onQuantityChange={setCurrentTicketCount}
          />
        ) : null;
      case AppState.PURCHASE_CONFIRMED:
        return purchase ? (
          <PurchaseConfirmation
            purchase={purchase}
            onBackToLobby={handleBackToLobby}
          />
        ) : null;
      case AppState.VIEWING_LOBBY:
      default:
        return selectedRoom ? (
          <RoomDetails
            room={selectedRoom}
            onBuyTickets={handleBuyTickets}
          />
        ) : (
          <div className="text-center p-10">
            <p className="text-xl text-gray-500">Select a room to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectRoom={handleSelectRoom} selectedRoomId={selectedRoom?.id ?? null} />
        <main className="flex-1 overflow-y-auto p-6 bg-bingo-light">
          <div className="container mx-auto max-w-4xl">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
