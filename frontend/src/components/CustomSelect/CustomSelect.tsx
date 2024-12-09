import React, { useState, useEffect, useMemo } from 'react';

interface CustomSelectProps {
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[] | string) => void;
  isSingleSelect?: boolean;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  selectedOptions,
  onChange,
  isSingleSelect = false,
  placeholder = "Search or add options...",
}) => {
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (el) =>
          el.toLowerCase().includes(search.toLowerCase()) &&
          !(isSingleSelect && selectedOptions.includes(el))
      ),
    [search, selectedOptions, options, isSingleSelect]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.custom-select')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOptionClick = (option: string) => {
    if (isSingleSelect) {
      onChange(option);
    } else {
      onChange([...selectedOptions, option]);
    }
    setSearch('');
    setShowOptions(false);
  };

  const handleSelectedOptionClick = (option: string) => {
    const updatedSelectedOptions = selectedOptions.filter((o) => o !== option);
    onChange(updatedSelectedOptions);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowOptions(true);
      setFocusedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setShowOptions(true);
      setFocusedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Enter' && filteredOptions[focusedIndex]) {
      e.preventDefault();
      setShowOptions(false);
      handleOptionClick(filteredOptions[focusedIndex]);
    }
  };

  return (
    <div className="custom-select relative w-full max-w-md">
      <div className="relative">
        <div
          className="flex items-center flex-wrap gap-2 min-h-[2.5rem] p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
          onClick={() => setShowOptions(true)}
        >
          {selectedOptions.map((option , index) => (
            <span
              key={option + `_${index}` }
              className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
            >
              {option}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectedOptionClick(option);
                }}
                className="ml-1 inline-flex items-center p-0.5 rounded-sm hover:bg-blue-200 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                x
              </button>
            </span>
          ))}
          <input
            className="flex-grow min-w-[50px] bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowOptions(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
          />
        </div>

      </div>
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none text-sm">
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                index === focusedIndex
                  ? 'text-white bg-blue-600 dark:bg-blue-700'
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;

