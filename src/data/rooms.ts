
import { BingoRoom } from '../types';

const now = new Date();

const getFutureTime = (minutesFromNow: number): string =>
  new Date(now.getTime() + minutesFromNow * 60000).toISOString();

export const rooms: BingoRoom[] = [
  {
    id: 1,
    name: 'Penny Room',
    ticketPrice: 0.10,
    prizePot: 50,
    playerCount: 43,
    nextGameTime: getFutureTime(10),
    status: 'open',
    isFeatured: false,
  },
  {
    id: 2,
    name: 'Silver Room',
    ticketPrice: 0.25,
    prizePot: 150,
    playerCount: 31,
    nextGameTime: getFutureTime(25),
    status: 'open',
    isFeatured: false,
  },
  {
    id: 3,
    name: 'Gold Room',
    ticketPrice: 1.00,
    prizePot: 500,
    playerCount: 22,
    nextGameTime: getFutureTime(45),
    status: 'open',
    isFeatured: false,
  },
  {
    id: 4,
    name: 'Diamond Room',
    ticketPrice: 5.00,
    prizePot: 2000,
    playerCount: 14,
    nextGameTime: getFutureTime(60),
    status: 'filling',
    isFeatured: false,
  },
  {
    id: 5,
    name: 'Jackpot Room',
    ticketPrice: 10.00,
    prizePot: 10000,
    playerCount: 9,
    nextGameTime: getFutureTime(90),
    status: 'open',
    isFeatured: true,
  },
];

export const getRoomById = (id: number): BingoRoom | undefined =>
  rooms.find(r => r.id === id);

export const getAllRooms = (): BingoRoom[] => rooms;
