import React from "react";

interface DropdownProps {
  label?: string;
  options: string[]; // list of dropdown items
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 bg-transparent">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-max bg-transparent/50 rounded-lg px-2 py-2 focus:outline-none
        ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        {options.map((option, index) => (
          <option className="" key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
