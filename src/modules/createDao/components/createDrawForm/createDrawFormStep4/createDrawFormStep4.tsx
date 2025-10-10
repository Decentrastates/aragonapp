'use client';

import { useFormContext } from 'react-hook-form';
import type { ICreateAppFormData } from '../createDrawFormDefinitions';

export interface ICreateDrawFormStep4Props {
    /**
     * Prefix to prepend to all the form fields.
     */
    fieldPrefix?: string;
}

export const CreateDrawFormStep4: React.FC<ICreateDrawFormStep4Props> = () => {
    // Get the entire form data using useFormContext
    const { getValues } = useFormContext<ICreateAppFormData>();
    const formData = getValues();
    // Format JSON data for display
    const formatJson = (data: unknown) => {
        try {
            return JSON.stringify(data, null, 2);
        } catch {
            return String(data);
        }
    };

    return <pre className="overflow-auto rounded bg-white p-2 text-xs">{formatJson(formData)}</pre>;
};
