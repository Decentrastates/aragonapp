import dynamic from 'next/dynamic';

export const DrawAppsBodyField = dynamic(() =>
    import('./drawAppsBodyField').then((mod) => mod.DrawAppsBodyField),
);

export type { IDrawAppsBodyFieldProps } from './drawAppsBodyField';
