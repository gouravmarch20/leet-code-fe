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
                text-sm bg-transparent/50
                ring-2 outline-none
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
