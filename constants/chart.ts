import { ChartOptions, DeepPartial } from "lightweight-charts";

export const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"];

export const CHART_CONFIG: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: "#1a1a1a" },
    textColor: "#d1d4dc",
    fontFamily: "IBMPlexMono",
  },
  grid: {
    vertLines: { color: "rgba(66, 66, 66, 1)" },
    horzLines: { color: "rgba(66, 66, 66, 1)" },
  },
  height: 400,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    borderColor: "#1f2937",
  },
}; 