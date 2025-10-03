import dynamic from 'next/dynamic';

export const DrawVotingTerminal = dynamic(() => import('./drawVotingTerminal').then((mod) => mod.DrawVotingTerminal));
export type { IDrawVotingTerminalProps } from './drawVotingTerminal';