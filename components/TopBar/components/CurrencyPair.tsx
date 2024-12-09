import Image from "next/image";
import { FC } from 'react';

export const CurrencyPair: FC = () => (
  <div className="flex items-start gap-3">
    <div className="flex items-center gap-2 py-1.5 transition-colors">
      <Image src="/btc.svg" alt="BTC" className="w-7 h-7" />
      <div className="flex flex-col">
        <span className="text-white font-medium uppercase">BTC / Bitcoin</span>
      </div>
    </div>
  </div>
); 