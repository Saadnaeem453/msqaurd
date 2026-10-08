import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0d0e12] border border-[#292a2b] rounded px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors flex items-center justify-between ${
          value ? "text-primary" : "text-gray-500"
        } ${className}`}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>


      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d0e12] border border-[#292a2b] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto no-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#1a1b1f] ${
                option.value === value
                  ? "text-primary bg-primary/5"
                  : "text-secondary hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
