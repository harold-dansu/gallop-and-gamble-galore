
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import { LogIn, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="bg-bingo-dark text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-bingo-yellow font-serif tracking-tight">
            Full House
          </h1>
          <p className="text-xs text-purple-300 mt-0.5">Play Bingo Online</p>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-purple-300 text-sm">{user?.name}</span>
              <button
                onClick={logout}
                className="bg-bingo-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-bingo-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm"
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default Header;
