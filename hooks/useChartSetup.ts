import { CHART_CONFIG } from '@/constants/chart';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { KlineData } from '@/types/websocket';
import { createChart, IChartApi, ISeriesApi, SeriesMarker, Time, UTCTimestamp } from "lightweight-charts";
import { RefObject, useEffect, useRef, useState } from 'react';

export const useChartSetup = (
  chartContainerRef: RefObject<HTMLDivElement>,
  chartData: KlineData[],
  interval: string
) => {
  const [candlestickSeries, setCandlestickSeries] = 
    useState<ISeriesApi<"Candlestick"> | null>(null);
  const [volumeSeries, setVolumeSeries] = 
    useState<ISeriesApi<"Histogram"> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      ...CHART_CONFIG,
      height: chartContainerRef.current.clientHeight || 500,
    });
    chartRef.current = chart;
    
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const volumeHistogram = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: "", 
    });

    chart.priceScale("").applyOptions({scaleMargins: {
      top: 0.8, 
        bottom: 0,
      },
    });

    const formattedChartData = chartData.map(kline => ({
      time: (Math.floor(kline.openTime / 1000)) as UTCTimestamp,
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close
    }));

    const formattedVolumeData = chartData.map(kline => ({
      time: (Math.floor(kline.openTime / 1000)) as UTCTimestamp,
      value: kline.volume,
      color: kline.close >= kline.open ? "#26a69a80" : "#ef535080"
    }));

    setCandlestickSeries(candleSeries);
    setVolumeSeries(volumeHistogram);
    
    candleSeries.setData(formattedChartData);
    volumeHistogram.setData(formattedVolumeData);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [chartData]);

  useEffect(() => {
    if (!candlestickSeries || !volumeSeries) return;

    const handleKlineUpdate = (klineData: [number, string, string, string, string]): void => {
      const [openTime, open, high, low, close] = klineData;
      const timestamp = Math.floor(openTime / 1000);
      
      if (isNaN(timestamp)) {
        console.error('Invalid timestamp:', openTime);
        return;
      }

      const formattedKline = {
        time: timestamp as UTCTimestamp,
        open: open,
        high: high,
        low: low,
        close: close,
      };
      
      // const formattedVolume = {
      //   time: timestamp as UTCTimestamp,
      //   value: parseFloat(volume),
      //   color: parseFloat(close) >= parseFloat(open) ? "#26a69a80" : "#ef535080"
      // };
      
      candlestickSeries.update(formattedKline);
      // volumeSeries.update(formattedVolume);
    };

    subscribe("BTC-PERP", interval, handleKlineUpdate);
    return () => unsubscribe();
  }, [interval, candlestickSeries, volumeSeries, subscribe, unsubscribe]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData("text/plain");
    if (!candlestickSeries || !chartContainerRef.current || !chartRef.current) return;

    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const coordinate = chartRef.current?.timeScale().coordinateToTime(x);
    if (coordinate) {
      const existingMarkers = candlestickSeries.markers();
      const existingMarkerIndex = existingMarkers.findIndex(
        (marker) => marker.time === coordinate
      );

      let newMarkers;
      if (existingMarkerIndex !== -1) {
        newMarkers = [...existingMarkers];
        newMarkers[existingMarkerIndex] = {
          ...newMarkers[existingMarkerIndex],
          text: emoji,
        };
      } else {
        newMarkers = [
          ...existingMarkers,
          {
            time: coordinate,
            position: "aboveBar",
            color: "#2196F3",
            shape: "circle",
            text: emoji,
          } as SeriesMarker<Time>,
        ];

        newMarkers.sort(
          (a, b) =>
            new Date(a.time as string).getTime() -
            new Date(b.time as string).getTime()
        );
      }

      candlestickSeries.setMarkers(newMarkers);
    }
  };

  return {
    candlestickSeries,
    handleDragOver,
    handleDrop
  };
};
