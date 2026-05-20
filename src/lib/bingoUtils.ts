
import { TicketGrid, BingoTicket } from '../types';

// Column ranges for 90-ball bingo (column index → [min, max])
const COLUMN_RANGES: [number, number][] = [
  [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
  [50, 59], [60, 69], [70, 79], [80, 90],
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generates a valid 3×9 boolean mask: exactly 5 true per row, 1–2 per column.
// Returns null if the random assignment doesn't balance — caller retries.
function generateMask(): boolean[][] | null {
  // 6 columns get 2 numbers, 3 columns get 1 → total 15 (5 per row × 3 rows)
  const doubleCols = new Set(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 6));
  const mask: boolean[][] = Array(3).fill(null).map(() => Array(9).fill(false));

  for (let c = 0; c < 9; c++) {
    const count = doubleCols.has(c) ? 2 : 1;
    shuffle([0, 1, 2]).slice(0, count).forEach(r => { mask[r][c] = true; });
  }

  return mask.every(row => row.filter(Boolean).length === 5) ? mask : null;
}

export function generateBingoTicket(id: number): BingoTicket {
  let mask: boolean[][] | null = null;
  while (!mask) mask = generateMask();

  const grid: TicketGrid = Array(3).fill(null).map(() => Array(9).fill(null));

  for (let c = 0; c < 9; c++) {
    const [min, max] = COLUMN_RANGES[c];
    const available: number[] = [];
    for (let n = min; n <= max; n++) available.push(n);

    const filledRows = [0, 1, 2].filter(r => mask![r][c]).sort((a, b) => a - b);
    const numbers = shuffle(available).slice(0, filledRows.length).sort((a, b) => a - b);
    filledRows.forEach((r, i) => { grid[r][c] = numbers[i]; });
  }

  return { id, grid };
}

export function generateTickets(count: number): BingoTicket[] {
  return Array.from({ length: count }, (_, i) => generateBingoTicket(i + 1));
}
