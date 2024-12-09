"use client";
import { INTERVALS } from '@/constants/chart';
import { useChartSetup } from '@/hooks/useChartSetup';
import { useKlineData } from '@/hooks/useKlineData';
import { useRef, useState } from "react";

const EthChart = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [interval, setInterval] = useState("1h");
  
  const { 
    chartData, 
    isLoading, 
    error 
  } = useKlineData("BTC-PERP", interval);

  const { 
    handleDragOver, 
    handleDrop 
  } = useChartSetup(chartContainerRef, chartData, interval);

  const renderIntervalButtons = () => (
    <div className="flex gap-2 mb-4 pt-2">
      {INTERVALS.map((int) => (
        <button
          key={int}
          onClick={() => setInterval(int)}
          className={`
            px-4 py-2 rounded
             text-sm
            transition-colors duration-200
            ${
              interval === int
                ? 'bg-[#26a69a] text-white shadow-lg shadow-[#26a69a]/20'
                : 'bg-custom-darkest-gray text-custom-gray hover:bg-custom-dark hover:text-custom-light'
            }
          `}
        >
          {int.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-full text-gray-400 ">
      Loading chart data...
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center h-full text-red-400 ">
      {error}
    </div>
  );

  const renderChart = () => (
    <div
      ref={chartContainerRef}
      className="w-full"
      style={{ height: "100%" }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );

  return (
    <div className="flex flex-col">
      {renderIntervalButtons()}
      {isLoading && renderLoadingState()}
      {error && renderErrorState()}
      {!isLoading && !error && renderChart()}
    </div>
  );
};

export default EthChart;
