// 'use client';

// import { DrawWidget } from '@/plugins/drawPlugin/components/drawWidget';
// // import { NftList } from '@/plugins/drawPlugin/components/nftList';
// import { mockNftList } from '@/plugins/drawPlugin/data/mockNftData';
// import { useDrawDialogs } from '@/plugins/drawPlugin/hooks/useDrawDialogs';
// import { useDrawEligibility } from '@/plugins/drawPlugin/hooks/useDrawEligibility';
// import { Page } from '@/shared/components/page';
// import { useTranslations } from '@/shared/components/translationsProvider';
// import { Button, Card, Icon, IconType } from '@cddao/gov-ui-kit';
// import Link from 'next/link';

// interface IDrawMainPageProps {
//     daoId: string;
// }

// export const DrawMainPage: React.FC<IDrawMainPageProps> = ({ daoId }) => {
//     const { t } = useTranslations();
//     const { isLoading, isEligible, eligibilityData } = useDrawEligibility(daoId);
//     const { openParticipateDrawDialogWithDaoId } = useDrawDialogs();

//     const handleDraw = () => {
//         openParticipateDrawDialogWithDaoId(daoId);
//     };

//     return (
//         <Page.Container>
//             <Page.Header
//                 title={t('app.plugins.draw.mainPage.title')}
//                 description={t('app.plugins.draw.mainPage.description')}
//             />
//             <Page.Content>
//                 <Page.Main>
//                     {/* 此处展示NFT列表 */}

//                     <NftList nfts={mockNftList} />

//                     {/* <Card className="p-6">
//                         <h2 className="mb-4 text-xl font-bold">{t('app.plugins.draw.mainPage.rewards')}</h2>
//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                             <div className="rounded-lg border p-4 text-center">
//                                 <Icon icon={IconType.PERSON} className="text-primary-500 mx-auto h-12 w-12" />
//                                 <h3 className="mt-2 font-medium">{t('app.plugins.draw.mainPage.reward1.title')}</h3>
//                                 <p className="text-sm text-neutral-600">
//                                     {t('app.plugins.draw.mainPage.reward1.description')}
//                                 </p>
//                             </div>
//                             <div className="rounded-lg border p-4 text-center">
//                                 <Icon icon={IconType.PERSON} className="text-primary-500 mx-auto h-12 w-12" />
//                                 <h3 className="mt-2 font-medium">{t('app.plugins.draw.mainPage.reward2.title')}</h3>
//                                 <p className="text-sm text-neutral-600">
//                                     {t('app.plugins.draw.mainPage.reward2.description')}
//                                 </p>
//                             </div>
//                             <div className="rounded-lg border p-4 text-center">
//                                 <Icon icon={IconType.PERSON} className="text-primary-500 mx-auto h-12 w-12" />
//                                 <h3 className="mt-2 font-medium">{t('app.plugins.draw.mainPage.reward3.title')}</h3>
//                                 <p className="text-sm text-neutral-600">
//                                     {t('app.plugins.draw.mainPage.reward3.description')}
//                                 </p>
//                             </div>
//                         </div>
//                     </Card> */}
//                     <Card className="p-6">
//                         <h2 className="mb-4 text-xl font-bold">{t('app.plugins.draw.mainPage.howItWorks')}</h2>
//                         <div className="space-y-4">
//                             <div className="flex items-start">
//                                 <div className="bg-primary-100 mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
//                                     <span className="text-primary-600 font-bold">1</span>
//                                 </div>
//                                 <div>
//                                     <h3 className="font-medium text-neutral-800">
//                                         {t('app.plugins.draw.mainPage.step1.title')}
//                                     </h3>
//                                     <p className="text-sm text-neutral-600">
//                                         {t('app.plugins.draw.mainPage.step1.description')}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start">
//                                 <div className="bg-primary-100 mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
//                                     <span className="text-primary-600 font-bold">2</span>
//                                 </div>
//                                 <div>
//                                     <h3 className="font-medium text-neutral-800">
//                                         {t('app.plugins.draw.mainPage.step2.title')}
//                                     </h3>
//                                     <p className="text-sm text-neutral-600">
//                                         {t('app.plugins.draw.mainPage.step2.description')}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-start">
//                                 <div className="bg-primary-100 mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
//                                     <span className="text-primary-600 font-bold">3</span>
//                                 </div>
//                                 <div>
//                                     <h3 className="font-medium text-neutral-800">
//                                         {t('app.plugins.draw.mainPage.step3.title')}
//                                     </h3>
//                                     <p className="text-sm text-neutral-600">
//                                         {t('app.plugins.draw.mainPage.step3.description')}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </Page.Main>
//                 <Page.Aside>
//                         <DrawWidget daoId={daoId} />

//                         <Card className="p-6">
//                             <h2 className="mb-4 text-xl font-bold">{t('app.plugins.draw.mainPage.eligibility')}</h2>
//                             {isLoading ? (
//                                 <div className="flex h-32 items-center justify-center">
//                                     <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-b-2" />
//                                 </div>
//                             ) : (
//                                 <div>
//                                     {isEligible ? (
//                                         <div className="text-center">
//                                             <Icon
//                                                 icon={IconType.SUCCESS}
//                                                 className="mx-auto h-12 w-12 text-green-500"
//                                             />
//                                             <p className="mt-2 font-medium text-green-600">
//                                                 {t('app.plugins.draw.mainPage.eligible')}
//                                             </p>
//                                             <Button onClick={handleDraw} size="lg" className="mt-4 w-full">
//                                                 {t('app.plugins.draw.mainPage.drawButton')}
//                                             </Button>
//                                         </div>
//                                     ) : (
//                                         <div className="text-center">
//                                             <Icon icon={IconType.WARNING} className="mx-auto h-12 w-12 text-red-500" />
//                                             <p className="mt-2 font-medium text-red-600">
//                                                 {t('app.plugins.draw.mainPage.notEligible')}
//                                             </p>
//                                             {eligibilityData?.reason && (
//                                                 <p className="mt-1 text-sm text-gray-500">{eligibilityData.reason}</p>
//                                             )}
//                                             <div className="mt-4 space-y-2 text-left text-sm">
//                                                 <div className="flex justify-between">
//                                                     <span>{t('app.plugins.draw.mainPage.tokenBalance')}</span>
//                                                     <span className="font-medium">
//                                                         {eligibilityData?.tokenBalance ?? '0'} TOKEN
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span>{t('app.plugins.draw.mainPage.requiredBalance')}</span>
//                                                     <span className="font-medium">100 TOKEN</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </Card>

//                         <Card className="p-6">
//                             <h2 className="mb-4 text-xl font-bold">{t('app.plugins.draw.mainPage.quickActions')}</h2>
//                             <div className="space-y-3">
//                                 <Link href={`/dao/${daoId}/draw/history`} className="block">
//                                     <Button variant="secondary" className="w-full">
//                                         {t('app.plugins.draw.mainPage.viewHistory')}
//                                     </Button>
//                                 </Link>
//                                 <Link href={`/dao/${daoId}/draw/rewards`} className="block">
//                                     <Button variant="secondary" className="w-full">
//                                         {t('app.plugins.draw.mainPage.redeemRewards')}
//                                     </Button>
//                                 </Link>
//                                 <Link href={`/dao/${daoId}/draw/participate`} className="block">
//                                     <Button variant="secondary" className="w-full">
//                                         {t('app.plugins.draw.mainPage.participate')}
//                                     </Button>
//                                 </Link>
//                             </div>
//                         </Card>
//                 </Page.Aside>
//             </Page.Content>
//         </Page.Container>
//     );
// };
