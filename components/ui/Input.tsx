import { AnimatePresence, motion } from "framer-motion";
import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
  helperText?: string;
}

const Input = ({
  label,
  error,
  suffix,
  helperText,
  className = "",
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-custom-light text-sm  mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className={`
          relative rounded-sm
          ${error ? 'border-red-500' : isFocused ? 'border-gray-600' : 'border-transparent'}
          transition-colors
        `}>
          <input
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full h-[48px] bg-custom-dark text-white px-3 pt-2 pb-1
              
              rounded-sm
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none
              ${suffix ? 'pr-12' : 'pr-3'}
              ${className}
            `}
          />
          
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-custom-gray ">{suffix}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-custom-light-gray text-sm mt-1"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input; 