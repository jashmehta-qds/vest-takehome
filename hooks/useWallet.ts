import { Ethereum } from '@thirdweb-dev/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useState } from 'react';

export const useWallet = () => {
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    try {
      const sdk = new ThirdwebSDK(Ethereum);
      const wallet = await sdk.wallet.connect(Ethereum);
      setAddress("...");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return { address, connectWallet };
}; 