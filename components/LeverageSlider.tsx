
// interface LeverageSliderProps {
//   value: number;
//   onChange: (value: number) => void;
// }

// const LeverageSlider = ({ value, onChange }: LeverageSliderProps) => {
//   const leveragePoints = [2, 5, 10, 25, 50, 100, 128];

//   return (
//     <div className="leverage-slider">
//       <div className="flex content-around mb-2 items-baseline justify-between">
//         <span className="text-custom-gray  text-sm">Leverage</span>
//         <span className="text-custom-light  text-sm">{value}.00X</span>
//       </div>
      
//       <input
//         type="range"
//         min="2"
//         max="128"
//         step="1"
//         value={value}
//         onChange={(e) => onChange(Number(e.target.value))}
//         list="leverage-points"
//       />
      
//       <div className="leverage-marks">
//         {leveragePoints.map((point) => (
//           <span 
//             key={point}
//             onClick={() => onChange(point)}
//             className="leverage-mark text-xs "
//             style={{ 
//               cursor: 'pointer',
//               color: value === point ? '#fff' : '#888'
//             }}
//           >
//             {point}X
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LeverageSlider; 



import React, { useEffect, useRef, useState } from "react";

interface LeverageSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  markerConfig: Array<{
    label: string;
    value: number;
  }>;
}

export const LeverageSlider: React.FC<LeverageSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 128,
  step = 1,
  markerConfig,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = (clientX: number) => {
    if (!sliderRef.current) return value;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const newValue = min + (max - min) * percentage;

    // Round to nearest step
    const roundedValue = Math.round(newValue / step) * step;
    return Math.min(Math.max(roundedValue, min), max);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    onChange(calculateValue(e.clientX));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    onChange(calculateValue(e.clientX));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
    <div className="flex content-around mb-2 items-baseline justify-between">
    <span className="text-custom-gray  text-sm">Leverage</span>
    <span className="text-custom-light  text-sm">{value}.00X</span>
  </div>
    <div className="relative py-3 px-2 pb-6 select-none">
      {/* Marker labels */}
      <div className="absolute bottom-0 left-0 right-0 h-6">
        {markerConfig.map(({ label, value: position }) => (
          <span
            key={position}
            className="absolute text-gray-500 text-xs whitespace-nowrap cursor-pointer hover:text-gray-300"
            style={{
              left: `${((position - min) / (max - min)) * 100}%`,
              transform: "translateX(-50%)",
              marginTop: "8px",
            }}
            onClick={() => {
              const firstMarkerValue = markerConfig[0]?.value ?? min;

              onChange(
                position < firstMarkerValue ? firstMarkerValue : position
              );
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Slider track */}
      <div
        ref={sliderRef}
        className="relative h-[6px] bg-custom-darkest-gray cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Marker lines */}
        {markerConfig.map(({ value: position }) => (
          <div
            key={position}
            className="absolute top-1/2 w-[2px] h-3 bg-custom-light-gray rounded"
            style={{
              left: `${((position - min) / (max - min)) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Filled track */}
        <div
          className="absolute h-full bg-custom-gray"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 bg-custom-gray border-2 border-custom-gray rounded-full cursor-grab active:cursor-grabbing"
          style={{
            left: `${percentage}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
    </div>
  );
};
