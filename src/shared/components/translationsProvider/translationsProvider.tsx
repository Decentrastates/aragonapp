'use client';

import { translationUtils, type ITFuncOptions, type Translations } from '@/shared/utils/translationsUtils';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useDebugContext } from '../debugProvider';

export interface ITranslationContext {
    /**
     * Function to process the given translation (e.g. replace keys with given values).
     */
    t: TranslationFunction;
}

export type TranslationFunction = (translation: string, options?: ITFuncOptions) => string;

const translationsContext = createContext<ITranslationContext | null>(null);

export interface ITranslationsProviderProps {
    /**
     * Translations for the selected language.
     */
    translations: Translations;
    /**
     * Children of the component.
     */
    children?: ReactNode;
}

export const TranslationsProvider: React.FC<ITranslationsProviderProps> = (props) => {
    const { translations: initialTranslations, children } = props;
    
    // State to hold current translations
    const [currentTranslations, setCurrentTranslations] = useState<Translations>(initialTranslations);

    const { values, registerControl } = useDebugContext<{ displayKeys: boolean }>();
    const { displayKeys } = values;

    const contextValues = useMemo(
        () => ({ t: translationUtils.t(currentTranslations, displayKeys) }),
        [currentTranslations, displayKeys],
    );

    useEffect(() => {
        registerControl({ name: 'displayKeys', type: 'boolean', label: 'Show translation keys' });
    }, [registerControl]);

    // Listen for language change events
    useEffect(() => {
        const handleLanguageChange = async (event: Event) => {
            // Type guard to ensure we have a CustomEvent with detail property
            if (!(event instanceof CustomEvent)) {
                console.warn('Language change event is not a CustomEvent');
                return;
            }
            
            const language = event.detail as string;
            
            // Validate language is a string
            if (typeof language !== 'string') {
                console.warn('Language change event detail is not a string:', language);
                return;
            }
            
            // Import the new translation file based on the language
            try {
                let newTranslations: unknown;
                switch (language) {
                    case 'zh':
                        newTranslations = await import('@/assets/locales/zh.json').then((module) => module.default);
                        break;
                    case 'en':
                    default:
                        newTranslations = await import('@/assets/locales/en.json').then((module) => module.default);
                        break;
                }
                
                // Validate that we received a valid translations object
                if (newTranslations && typeof newTranslations === 'object') {
                    setCurrentTranslations(newTranslations as Translations);
                } else {
                    console.error('Invalid translations object received:', newTranslations);
                    // Fallback to initial translations if there's an error
                    setCurrentTranslations(initialTranslations);
                }
            } catch (error) {
                console.error('Error loading translations:', error);
                // Fallback to initial translations if there's an error loading the translation file
                setCurrentTranslations(initialTranslations);
            }
        };

        // Add event listener for language change
        window.addEventListener('languageChange', handleLanguageChange as EventListener);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('languageChange', handleLanguageChange as EventListener);
        };
    }, [initialTranslations]);

    return <translationsContext.Provider value={contextValues}>{children}</translationsContext.Provider>;
};

export const useTranslations = () => {
    const values = useContext(translationsContext);

    if (values == null) {
        throw new Error('useTranslations: hook must be used within the TranslationsContextProvider to work properly.');
    }

    return values;
};