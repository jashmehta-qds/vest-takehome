"use client";
import { Ethereum } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState } from "react";
import {
  BellIcon,
  FilledDropdownIcon,
  SearchIcon,
} from "./TopBar/components/Icons";

const Header = () => {
  const [address, setAddress] = useState<string>("0xfC...E63d1");
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const sdk = new ThirdwebSDK(Ethereum, {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });

      const addr = "...";
      setAddress(addr);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header>
      <div className=" mx-auto py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="relative flex items-center">
              <div className="absolute left-11 text-gray-500">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="SEARCH"
                className="w-full bg-[#1a1a1a] text-white pl-10 pr-4 py-2.5
                          transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                         placeholder-gray-500 text-sm"
                aria-label="Search markets"
              />
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <div className="text-custom-gray">
              <BellIcon />
            </div>
            <button
              disabled={isConnecting}
              className={` py-2.5 font-normal text-sm
                ${
                  address
                    ? "text-custom-light "
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                } 
                transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isConnecting ? "Connecting..." : address || "Connect Wallet"}
            </button>
            <FilledDropdownIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
