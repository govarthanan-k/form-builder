import { useEffect, useRef, useState } from "react";

import { Check, ChevronRight, X } from "lucide-react";

import { MultiSelectDropdownProps } from "./types";

// MultiSelectDropdown component
export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  onChange,
  options,
  placeholder = "Select options...",
  value = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    const newValue = value.includes(option) ? value.filter((v) => v !== option) : [...value, option];
    onChange(newValue);
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== option));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            value.map((item) => (
              <span key={item} className="bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium">
                {item}
                <button onClick={(e) => removeOption(item, e)} className="hover:bg-primary/20 ml-1 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </div>

      {isOpen && (
        <div className="bg-popover text-popover-foreground absolute top-full z-50 mt-1 w-full rounded-md border p-1 shadow-md">
          {options.map((option) => {
            const isSelected = value.includes(option);

            return (
              <div
                key={option}
                className="hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none"
                onClick={() => toggleOption(option)}
              >
                <div className="flex flex-1 items-center gap-2">{option}</div>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
