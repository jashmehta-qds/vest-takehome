import { FC } from 'react';
import { TradingStats } from './components/TradingStats';

const TopBar: FC = () => {

  return (
    <header className="flex items-center justify-between py-2 border-b border-custom-darker">
      <TradingStats />
    </header>
  );
};

export default TopBar; 