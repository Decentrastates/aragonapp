import dynamic from 'next/dynamic';

export const PrepareDrawDialog = dynamic(() =>
    import('./prepareDrawDialog').then((mod) => mod.PrepareDrawDialog),
);
export type { IPrepareDrawDialogParams, IPrepareDrawDialogProps } from './prepareDrawDialog.api';