'use client';

import { useTranslations } from '@/shared/components/translationsProvider';
import { MemberAvatar } from '@cddao/gov-ui-kit';
import type { IDaoPlugin } from '@/shared/api/daoService';
import type { IDrawPluginSettings } from '../../types';

export interface IDrawMemberPanelProps {
    /**
     * Plugin to display member panel for.
     */
    plugin: IDaoPlugin<IDrawPluginSettings>;
}

export const DrawMemberPanel: React.FC<IDrawMemberPanelProps> = (props) => {
    const { plugin } = props;
    console.log('DrawMemberPanel',props, plugin);
    
    const { t } = useTranslations();
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <MemberAvatar address="0x0000000000000000000000000000000000000000" />
                <div className="flex flex-col">
                    <span className="font-medium text-neutral-800">
                        {t('app.plugins.draw.drawMemberPanel.member')}
                    </span>
                    <span className="text-sm text-neutral-500">
                        {t('app.plugins.draw.drawMemberPanel.description')}
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Member info card */}
                <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-neutral-800">
                        {t('app.plugins.draw.drawMemberPanel.memberInfo')}
                    </h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="text-neutral-500">
                                {t('app.plugins.draw.drawMemberPanel.memberSince')}
                            </span>
                            <span className="font-medium text-neutral-800">
                                {t('app.plugins.draw.drawMemberPanel.memberSinceValue')}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Governance info card */}
                <div className="rounded-lg border border-neutral-200 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-neutral-800">
                        {t('app.plugins.draw.drawMemberPanel.governanceInfo')}
                    </h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="text-neutral-500">
                                {t('app.plugins.draw.drawMemberPanel.votingPower')}
                            </span>
                            <span className="font-medium text-neutral-800">
                                {t('app.plugins.draw.drawMemberPanel.votingPowerValue')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};