'use client';

import type { IDrawMember, IDrawPluginSettings } from '@/plugins/drawPlugin/types';
import type { IDaoPlugin } from '@/shared/api/daoService';
import { useTranslations } from '@/shared/components/translationsProvider';
import { formatterUtils, MemberDataListItem, NumberFormat } from '@cddao/gov-ui-kit';

export interface IDrawMemberListItemProps {
    /**
     * Member to display.
     */
    member: IDrawMember;
    /**
     * ID of the DAO the member belongs to.
     */
    daoId: string;
    /**
     * Plugin the member belongs to.
     */
    plugin: IDaoPlugin<IDrawPluginSettings>;
}

export const DrawMemberListItem: React.FC<IDrawMemberListItemProps> = (props) => {
    const { member, daoId } = props;
    const { address, ens, isEligible, tokenBalance } = member;

    const { t } = useTranslations();

    const memberHref = `/dao/${daoId}/members/${address}`;
    
    // Format token balance if available
    const formattedTokenBalance = tokenBalance 
        ? formatterUtils.formatNumber(tokenBalance, { format: NumberFormat.TOKEN_AMOUNT_SHORT }) 
        : '0';

    return (
        <MemberDataListItem.Structure
            address={address}
            ensName={ens ?? undefined}
            href={memberHref}
        >
            <div className="flex flex-col gap-1">
                <span className="font-medium text-neutral-800">
                    {ens ?? address}
                </span>
                <span className="text-sm text-neutral-500">
                    {isEligible 
                        ? t('app.plugins.draw.drawMemberListItem.eligible') 
                        : t('app.plugins.draw.drawMemberListItem.notEligible')}
                </span>
                <span className="text-sm text-neutral-500">
                    {t('app.plugins.draw.drawMemberListItem.balance')}: {formattedTokenBalance} tokens
                </span>
            </div>
        </MemberDataListItem.Structure>
    );
};