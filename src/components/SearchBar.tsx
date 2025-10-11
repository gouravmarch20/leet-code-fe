import React from "react";
// optional icon library

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    value,
    onChange,
    className = "",
}) => {


    return (
        <div
            className={`relative flex items-center w-full max-w-xs ${className}`}
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
                w-full pl-9 pr-3 py-2
                text-sm text-gray-700 dark:text-gray-200
                bg-white bg-transparent/50
                border border-gray-300 dark:border-gray-600
                rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                placeholder-gray-400
                transition-all duration-200
                "
            />
        </div>
    );
};

export default SearchBar;
