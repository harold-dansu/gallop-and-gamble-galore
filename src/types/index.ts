
export interface BingoRoom {
  id: number;
  name: string;
  ticketPrice: number;
  prizePot: number;
  playerCount: number;
  nextGameTime: string;
  status: 'open' | 'filling' | 'starting';
  isFeatured: boolean;
}

export type TicketGrid = (number | null)[][];

export interface BingoTicket {
  id: number;
  grid: TicketGrid;
}

export interface TicketPurchase {
  id: number;
  roomId: number;
  roomName: string;
  ticketPrice: number;
  ticketCount: number;
  totalCost: number;
  tickets: BingoTicket[];
}
