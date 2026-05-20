
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { BingoRoom } from '../types';
import { trackUserLogin } from '../lib/tracking';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: BingoRoom;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, room }) => {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    if (room) trackUserLogin(room);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-bingo-dark">Login to Full House</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value="johnsmith@gmail.com"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value="********"
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50"
            />
          </div>
          <Button
            className="w-full bg-bingo-purple hover:bg-bingo-dark text-white font-bold"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
