import dynamic from 'next/dynamic';

export const DrawRedeemDialog = dynamic(() =>
    import('./drawRedeemDialog.tsx').then((mod) => mod.DrawRedeemDialog),
);

export type { IDrawRedeemDialogParams, IDrawRedeemDialogProps } from './drawRedeemDialog.tsx';