
import React from 'react';
import { TicketGrid } from '../types';

interface BingoTicketCardProps {
  grid: TicketGrid;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BingoTicketCard: React.FC<BingoTicketCardProps> = ({ grid, title, size = 'md' }) => {
  const cellClass =
    size === 'sm'
      ? 'w-7 h-7 text-[10px]'
      : size === 'lg'
      ? 'w-10 h-10 text-sm'
      : 'w-8 h-8 text-xs';

  return (
    <div className="bg-white rounded-xl shadow border border-purple-200 overflow-hidden select-none">
      {title && (
        <div className="bg-bingo-purple text-white text-xs font-bold text-center py-1 px-2">
          {title}
        </div>
      )}
      <div className="p-2 space-y-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${cellClass} flex items-center justify-center rounded font-bold border ${
                  cell !== null
                    ? 'bg-white border-purple-300 text-bingo-dark'
                    : 'bg-bingo-lavender border-purple-100'
                }`}
              >
                {cell !== null ? cell : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoTicketCard;
