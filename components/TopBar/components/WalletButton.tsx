import { FC } from 'react';
import { WalletIcon } from './Icons';

interface WalletButtonProps {
  address: string;
  onConnect: () => Promise<void>;
}

export const WalletButton: FC<WalletButtonProps> = ({ address, onConnect }) => (
  <button
    onClick={onConnect}
    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white font-medium text-sm flex items-center gap-2"
  >
    <WalletIcon />
    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
  </button>
); 