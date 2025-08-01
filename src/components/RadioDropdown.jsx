import React, { useState } from 'react';

function RadioDropdown({ label, options, selectedValue, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsRotated(!isRotated);
  };

  const handleRadioChange = (id) => {
    const selectedOption = options.find(opt => opt.id === id);
    onSelect(selectedOption ? selectedOption.value : null);
    setIsOpen(false);
    setIsRotated(false);
  }

  return (
    <div className="w-full ">
      <label htmlFor={`dropdown-${label}`} className="block text-sm font-medium text-gray-700 mb-2">
        
      </label>
      <div className="relative">
        <button
          id={`dropdown-${label}`}
          type="button"
          className="w-[90%] justify-between btn inline-flex items-center rounded-md border border-gray-300 bg-primary px-4 py-2 text-sm  font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={toggleDropdown}
        >
          {selectedValue ? options.find(opt => opt.value === selectedValue)?.label : `Select ${label}`}
          <svg
            className={`-mr-1 ml-2 h-5 w-5 text-gray-100 transition-transform duration-200 ${isRotated ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute w-50 mt-1 rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center px-4 py-2 text-sm text-slate-300 font-bold hover:bg-indigo-900 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`option-${label}`}
                    checked={selectedValue === option.value}
                    onChange={() => handleRadioChange(option.id)}
                    className="form-radio text-indigo-600 mr-2 radio radio-accent"
                  />
                  <span className="ml-3">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RadioDropdown;