"use client";

import React from "react";

interface TabOption {
  value: string;
  label: string;
  color: string;
  hoverColor: string;
}

interface TabSelectorProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  console.log("options", options);
  return (
    <div className={`flex gap-6 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2 text-${option.color} border-b-2  text-sm ${
            value === option.value
              ? `${"border-" + option.color}`
              : `border-transparent hover:border-${option.hoverColor}`
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
