// 'use client';

// import { Card } from '@cddao/gov-ui-kit';
// import type { MockNftItem } from '../../data/mockNftData';

// export interface INftListProps {
//     /**
//      * NFT列表数据
//      */
//     nfts: MockNftItem[];
// }

// export const NftList: React.FC<INftListProps> = ({ nfts }) => {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {nfts.map((nft) => (
//                 <Card key={nft.id} className="overflow-hidden rounded-lg border-neutral-200">
//                     <div className="bg-gray-200 border-dashed rounded-xl w-full h-48" />
//                     <div className="p-4">
//                         <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
//                         <p className="text-sm text-gray-600 mb-3">{nft.description}</p>
//                         <div className="flex flex-wrap gap-1">
//                             {nft.attributes.map((attr, index) => (
//                                 <span 
//                                     key={index} 
//                                     className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                                 >
//                                     {attr.trait_type}: {attr.value}
//                                 </span>
//                             ))}
//                         </div>
//                         {/* <div className="mt-3 text-xs text-gray-500">
//                             <p>ID: {nft.tokenId}</p>
//                             <p className="truncate">Contract: {nft.contractAddress}</p>
//                         </div> */}
//                     </div>
//                 </Card>
//             ))}
//         </div>
//     );
// };