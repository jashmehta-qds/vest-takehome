import { KlineData } from '@/types/websocket';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const useKlineData = (symbol: string, interval: string) => {
  const [chartData, setChartData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKlineData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const endTime = Date.now();
        const startTime = endTime - 7 * 24 * 60 * 60 * 1000;

        const response = await axios.get("/api/klines", {
          params: {
            symbol,
            interval,
            startTime: startTime.toString(),
            endTime: endTime.toString(),
            limit: "1000",
          },
        });

        const formattedData: KlineData[] = response.data
          .map((item: any) => ({
            openTime: parseInt(item[0]),
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
            volume: parseFloat(item[5]),
          }))
          .sort((a: KlineData, b: KlineData) => a.openTime - b.openTime);

        setChartData(formattedData);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? `Failed to fetch chart data: ${error.message}`
          : "Failed to fetch chart data";
        setError(message);
        console.error("Error fetching kline data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKlineData();
  }, [symbol, interval]);

  return { chartData, isLoading, error };
}; 