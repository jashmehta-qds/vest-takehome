import { FC } from "react";
import { CurrencyPair } from "./CurrencyPair";

interface StatItemProps {
  label: string;
  value: string;
  valueColor?: string;
}

const StatItem: FC<StatItemProps> = ({
  label,
  value,
  valueColor = "text-white",
}) => (
  <div className="flex flex-col items-start flex-1 ">
    <span className="text-gray-400 text-[10px]  ">{label}</span>
    <span className={`text-sm text-left ${valueColor}`}>{value}</span>
  </div>
);

export const TradingStats: FC = () => {
  const stats = [
    { label: "PRICE", value: "$31,119.01" },
    { label: "24H CHANGE", value: "+22.3 USDC", valueColor: "text-[#26a69a]" },
    { label: "1H FUNDING", value: "0.00012%", valueColor: "text-[#26a69a]" },
    {
      label: "LONG INTEREST",
      value: "8.871 BTC",
      valueColor: "text-[#26a69a]",
    },
    {
      label: "SHORT INTEREST",
      value: "8.871 BTC",
      valueColor: "text-[#26a69a]",
    },
  ];

  return (
    <div className="flex items-center justify-between flex-1 text-sm">
      <div className="flex flex-1 items-start">
        <CurrencyPair />
      </div>
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
};
