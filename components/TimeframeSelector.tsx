interface TimeframeSelectorProps {
    value: string;
    onChange: (timeframe: string) => void;
  }
  
  const TimeframeSelector = ({ value, onChange }: TimeframeSelectorProps) => {
    const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
  
    return (
      <div className="flex items-center gap-2 bg-custom-darker p-2 rounded">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onChange(tf)}
            className={`
              px-4 py-2 rounded
               text-sm
              transition-colors duration-200
              ${
                value === tf 
                  ? 'bg-[#26a69a] text-white shadow-lg shadow-[#26a69a]/20' 
                  : 'bg-custom-darkest-gray text-custom-gray hover:bg-custom-dark hover:text-custom-light'
              }
            `}
          >
            {tf}
          </button>
        ))}
      </div>
    );
  };
  
  export default TimeframeSelector;