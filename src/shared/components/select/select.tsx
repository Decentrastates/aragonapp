import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectProps {
  /**
   * Options to display in the select dropdown
   */
  options: ISelectOption[];
  /**
   * Selected value
   */
  value?: string;
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Accessible name for the select
   */
  'aria-label'?: string;
  /**
   * ID of the element that labels the select
   */
  'aria-labelledby'?: string;
  /**
   * ID for the select element
   */
  id?: string;
}

export const Select: React.FC<ISelectProps> = (props) => {
  const { options, value, onValueChange, placeholder, disabled, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, id } = props;
  
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Determine dropdown direction based on available space
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Set dropdown direction based on available space
      // If there's not enough space below, but more space above, show dropdown upwards
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownDirection('up');
      } else {
        setDropdownDirection('down');
      }
    }
  }, [isOpen]);
  
  // Find selected option
  const selectedOption = options.find(option => option.value === value) ?? 
    (placeholder ? { value: '', label: placeholder } : options.length > 0 ? options[0] : undefined);
  
  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) {return;}
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  // Handle option keyboard events
  const handleOptionKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleOptionSelect(optionValue);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  return (
    <div className="relative" ref={selectRef}>
      {/* Select trigger */}
      <div
        id={id}
        className={classNames(
          'flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[42px] h-auto',
          {
            'border-gray-300 hover:border-gray-400 cursor-pointer': !disabled,
            'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed': disabled,
            'border-blue-500 ring-2 ring-blue-500': isOpen,
          },
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        {...(isOpen ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' })}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
        {...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {})}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={classNames(
            'w-4 h-4 text-gray-500 transition-transform duration-200',
            { 'rotate-180': isOpen }
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={classNames(
            'absolute z-10 w-full rounded-lg border border-gray-200 bg-white shadow-lg',
            {
              'mt-1': dropdownDirection === 'down',
              'mb-1': dropdownDirection === 'up',
            }
          )}
          style={{
            [dropdownDirection === 'down' ? 'top' : 'bottom']: dropdownDirection === 'down' ? '100%' : '100%',
          }}
        >
          <ul className="max-h-60 overflow-auto py-1" role="listbox">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  className={classNames(
                    'px-3 py-2 text-sm cursor-pointer hover:bg-gray-50',
                    {
                      'bg-blue-50 text-blue-700': isSelected,
                      'text-gray-900': !isSelected,
                    }
                  )}
                  onClick={() => handleOptionSelect(option.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};