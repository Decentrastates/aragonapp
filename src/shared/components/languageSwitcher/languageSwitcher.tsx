'use client';

import React from 'react';
import { Button, Dropdown } from '@cddao/gov-ui-kit';
import { useTranslations } from '../translationsProvider';

export interface ILanguageSwitcherProps {
    /**
     * Additional class names to apply to the component
     */
    className?: string;
}

export const LanguageSwitcher: React.FC<ILanguageSwitcherProps> = (props) => {
    const { className } = props;
    const { t } = useTranslations();
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Get initial language from cookie or default to 'en'
    const [currentLanguage, setCurrentLanguage] = React.useState<string>('en');

    // Set the initial language after mounting
    React.useEffect(() => {
        const savedLanguage = typeof window !== 'undefined' 
            ? localStorage.getItem('language') ?? document.cookie.split('; ').find(row => row.startsWith('language='))?.split('=')[1] ?? 'en'
            : 'en';
        
        if (savedLanguage && savedLanguage !== 'en') {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    const languageOptions = [
        { value: 'en', label: t('app.shared.languageSwitcher.english') },
        { value: 'zh', label: t('app.shared.languageSwitcher.chinese') },
    ];

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Note: The dropdown handles its own open/close state through the gov-ui-kit component
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (value: string) => {
        console.log(`Selected language: ${value}`);
        // Save the selected language to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', value);

            // Also set a cookie that expires in 30 days
            const expires = new Date();
            expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
            document.cookie = `language=${value};expires=${expires.toUTCString()};path=/`;
        }

        // Update the state
        setCurrentLanguage(value);

        // Dispatch a custom event for language change
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('languageChange', { detail: value }));
        }
    };

    const selectedLanguageLabel =
        languageOptions.find((option) => option.value === currentLanguage)?.label ?? t('app.shared.languageSwitcher.english');

    // Custom SVG icon for the dropdown arrow
    const ChevronDownIcon = () => (
        <svg 
            className="w-4 h-4 ml-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <div className={`relative ${className ?? ''}`} ref={dropdownRef}>
            <Dropdown.Container
                className="absolute right-0 z-50 mt-1 min-w-[120px]"
                customTrigger={
                    <Button variant="tertiary" size="lg">
                        <span className="flex items-center">
                            {selectedLanguageLabel}
                            <ChevronDownIcon />
                        </span>
                    </Button>
                }
            >
                {languageOptions.map((option) => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => handleLanguageChange(option.value)}
                        role="menuitem"
                        className="w-full cursor-pointer px-4 py-2 text-left text-sm text-neutral-800 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none"
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Container>
        </div>
    );
};