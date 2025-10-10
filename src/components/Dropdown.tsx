import React from "react";

interface DropdownProps {
  label?: string;
  options: string[]; // list of dropdown items
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className={`flex flex-col gap-1`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-blue-700 w-max rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
