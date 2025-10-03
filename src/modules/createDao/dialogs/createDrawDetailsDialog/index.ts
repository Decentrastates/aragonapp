import dynamic from 'next/dynamic';

export const CreateDrawDetailsDialog = dynamic(() =>
    import('./createDrawDetailsDialog').then((mod) => mod.CreateDrawDetailsDialog),
);
export type { ICreateDrawDetailsDialogParams, ICreateDrawDetailsDialogProps } from './createDrawDetailsDialog';
