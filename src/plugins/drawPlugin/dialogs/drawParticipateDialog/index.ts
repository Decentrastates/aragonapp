import dynamic from 'next/dynamic';

export const DrawParticipateDialog = dynamic(() =>
    import('./drawParticipateDialog.tsx').then((mod) => mod.DrawParticipateDialog),
);

export type { IDrawParticipateDialogParams, IDrawParticipateDialogProps } from './drawParticipateDialog.tsx';