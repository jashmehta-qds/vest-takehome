"use client";

import { WebSocketService } from '@/services/websocket';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface WebSocketContextType {
  subscribe: (symbol: string, interval: string, callback: (data: [number, string, string, string, string]) => void) => void;
  unsubscribe: () => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocketService | null>(null);
  const callbackRef = useRef<((data:[number, string, string, string, string]) => void) | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    wsRef.current = new WebSocketService(false);
    wsRef.current.onConnectionChange = (status: boolean) => {
      setIsConnected(status);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
      callbackRef.current = null;
    };
  }, []);

  useEffect(() => {
    const reconnectInterval = setInterval(() => {
      if (wsRef.current && !wsRef.current.isConnected()) {
        console.log('Attempting to reconnect...');
        wsRef.current.connect();
      }
    }, 5000);

    return () => {
      clearInterval(reconnectInterval);
    };
  }, []);

  const subscribe = useCallback((symbol: string, interval: string, callback: (data: [number, string, string, string, string]) => void) => {
    if (!wsRef.current) {
      wsRef.current = new WebSocketService(false);
    }
    
    callbackRef.current = callback;
    wsRef.current.onKlineUpdate = (data: [number, string, string, string, string]) => {
      if (callbackRef.current) {
        const parsedData: [number, number, number, number, number] = [
          data[0],
          parseFloat(data[1]),
          parseFloat(data[2]),
          parseFloat(data[3]),
          parseFloat(data[4])
        ];
        callbackRef.current(parsedData as any);
      }
    };

    if (!wsRef.current.isConnected()) {
      wsRef.current.connect();
      wsRef.current.onConnectionChange = (status: boolean) => {
        setIsConnected(status);
        if (status) {
          wsRef.current?.subscribeToKlines(symbol, interval);
        }
      };
    } else {
      wsRef.current.subscribeToKlines(symbol, interval);
    }
  }, []);

  const unsubscribe = useCallback(() => {
    try {
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
      callbackRef.current = null;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }, []);

  const value = useMemo(() => ({
    subscribe,
    unsubscribe,
    isConnected
  }), [subscribe, unsubscribe, isConnected]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
