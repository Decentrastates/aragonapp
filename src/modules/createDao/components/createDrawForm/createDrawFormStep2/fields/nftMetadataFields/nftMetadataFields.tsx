// 'use client';

// import { useTranslations } from '@/shared/components/translationsProvider';
// import { Collapsible, InputText, TextArea } from '@cddao/gov-ui-kit';
// import { useEffect, useRef, useState } from 'react';
// import type { IErc1155Metadata } from '../../../createDrawFormDefinitions';

// export interface INftMetadataFieldsProps {
//   /**
//    * Reset counter to trigger NFT metadata reset
//    */
//   resetCounter?: number;
// }

// export const NftMetadataFields: React.FC<INftMetadataFieldsProps> = (props) => {
//   const { resetCounter } = props;

//   const { t } = useTranslations();
//   const prevResetCounterRef = useRef<number | undefined>(undefined);

//   // State for NFT metadata
//   const [erc1155Metadata, setErc1155Metadata] = useState<IErc1155Metadata[]>([]);

//   // Function to add a new NFT metadata entry
//   const addNftMetadata = () => {
//     setErc1155Metadata([
//       ...erc1155Metadata,
//       {
//         name: '',
//         description: '',
//         image: '',
//         animation_url: undefined,
//         external_url: undefined,
//         background_color: undefined,
//         supply: 0,
//         attributes: [],
//       },
//     ]);
//   };

//   // Function to update NFT metadata
//   const updateNftMetadata = (
//     index: number,
//     field: 'name' | 'description' | 'image' | 'animation_url' | 'external_url' | 'background_color' | 'supply',
//     value: string,
//   ) => {
//     setErc1155Metadata((prevMetadata) => {
//       const updatedMetadata = [...prevMetadata];
//       if (field === 'image') {
//         // Automatically prepend ipfs:// to the CID
//         const formattedValue = value.startsWith('ipfs://') ? value : `ipfs://${value}`;
//         updatedMetadata[index] = {
//           ...updatedMetadata[index],
//           [field]: formattedValue,
//         };
//       } else {
//         updatedMetadata[index] = {
//           ...updatedMetadata[index],
//           [field]: value,
//         };
//       }
//       return updatedMetadata;
//     });
//   };

//   // Function to remove NFT metadata
//   const removeNftMetadata = (index: number) => {
//     setErc1155Metadata((prevMetadata) => {
//       const updatedMetadata = [...prevMetadata];
//       updatedMetadata.splice(index, 1);
//       return updatedMetadata;
//     });
//   };

//   // Function to add attribute to NFT metadata
//   const addAttribute = (index: number) => {
//     setErc1155Metadata((prevMetadata) => {
//       const updatedMetadata = [...prevMetadata];
//       updatedMetadata[index] = {
//         ...updatedMetadata[index],
//         attributes: [...updatedMetadata[index].attributes, { trait_type: '', value: '' }],
//       };
//       return updatedMetadata;
//     });
//   };

//   // Function to update attribute
//   const updateAttribute = (
//     nftIndex: number,
//     attrIndex: number,
//     field: 'trait_type' | 'value',
//     value: string | number,
//   ) => {
//     setErc1155Metadata((prevMetadata) => {
//       const updatedMetadata = [...prevMetadata];
//       const updatedAttributes = [...updatedMetadata[nftIndex].attributes];
//       updatedAttributes[attrIndex] = {
//         ...updatedAttributes[attrIndex],
//         [field]: value,
//       };
//       updatedMetadata[nftIndex] = {
//         ...updatedMetadata[nftIndex],
//         attributes: updatedAttributes,
//       };
//       return updatedMetadata;
//     });
//   };

//   // Function to remove attribute
//   const removeAttribute = (nftIndex: number, attrIndex: number) => {
//     setErc1155Metadata((prevMetadata) => {
//       const updatedMetadata = [...prevMetadata];
//       const updatedAttributes = [...updatedMetadata[nftIndex].attributes];
//       updatedAttributes.splice(attrIndex, 1);
//       updatedMetadata[nftIndex] = {
//         ...updatedMetadata[nftIndex],
//         attributes: updatedAttributes,
//       };
//       return updatedMetadata;
//     });
//   };

//   // Effect to reset NFT metadata when resetCounter changes
//   useEffect(() => {
//     // Only reset when resetCounter actually changes (not on initial mount)
//     if (prevResetCounterRef.current !== undefined && prevResetCounterRef.current !== resetCounter) {
//       setErc1155Metadata([]);
//     }
    
//     // Update the previous reset counter value
//     prevResetCounterRef.current = resetCounter;
//   }, [resetCounter]);

//   return (
//     <div className="mt-6 border-t border-neutral-200 pt-6">
//       <h3 className="text-lg font-medium">
//         {t('app.plugins.draw.createDrawForm.step2.nftMetadata.title.label')}
//       </h3>
//       <p className="mb-4 text-sm text-neutral-500">
//         {t('app.plugins.draw.createDrawForm.step2.nftMetadata.title.description')}
//       </p>

//       {erc1155Metadata.map((metadata, nftIndex) => (
//         <div 
//           key={nftIndex}
//           onClick={(e: React.MouseEvent) => {
//             // 阻止事件冒泡到表单，防止触发表单提交
//             e.preventDefault();
//             e.stopPropagation();
//           }}
//           onKeyDown={(e: React.KeyboardEvent) => {
//             // 阻止键盘事件冒泡到表单
//             if (e.key === 'Enter' || e.key === ' ') {
//               e.preventDefault();
//               e.stopPropagation();
//             }
//           }}
//           role="button"
//           tabIndex={0}
//           aria-label={t('app.plugins.draw.createDrawForm.step2.nftMetadata.nftItem', {
//             index: nftIndex + 1,
//           })}
//         >
//           <Collapsible
//             buttonLabelClosed={t('app.plugins.draw.createDrawForm.step2.nftMetadata.buttonLabelClosed', {
//               index: nftIndex + 1,
//             })}
//             buttonLabelOpened={t('app.plugins.draw.createDrawForm.step2.nftMetadata.buttonLabelOpened', {
//               index: nftIndex + 1,
//             })}
//             className="mb-4 p-4 rounded-lg border border-neutral-200"
//           >
//             <div>
//               <div className="mb-3 flex items-center justify-between">
//                 <h4 className="font-medium">
//                   {t('app.plugins.draw.createDrawForm.step2.nftMetadata.nftItem', {
//                     index: nftIndex + 1,
//                   })}
//                 </h4>
//                 <button
//                   type="button"
//                   onClick={() => removeNftMetadata(nftIndex)}
//                   className="text-sm text-red-600 hover:text-red-800"
//                 >
//                   {t('app.plugins.draw.createDrawForm.step2.nftMetadata.removeAction')}
//                 </button>
//               </div>

//               <InputText
//                 label={t('app.plugins.draw.createDrawForm.step2.nftMetadata.name.label')}
//                 value={metadata.name}
//                 onChange={(e) => updateNftMetadata(nftIndex, 'name', e.target.value)}
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.name.placeholder',
//                 )}
//                 className="mb-3"
//               />

//               <TextArea
//                 label={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.description.label',
//                 )}
//                 value={metadata.description}
//                 onChange={(e) => updateNftMetadata(nftIndex, 'description', e.target.value)}
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.description.placeholder',
//                 )}
//                 className="mb-3"
//               />

//               <InputText
//                 label={t('app.plugins.draw.createDrawForm.step2.nftMetadata.image.label')}
//                 value={metadata.image.replace('ipfs://', '')}
//                 onChange={(e) => updateNftMetadata(nftIndex, 'image', e.target.value)}
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.image.placeholder',
//                 )}
//                 helpText={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.image.helpText',
//                 )}
//                 className="mb-4"
//               />

//               <InputText
//                 label={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.animation_url.label',
//                 )}
//                 value={metadata.animation_url ?? ''}
//                 onChange={(e) =>
//                   updateNftMetadata(nftIndex, 'animation_url', e.target.value)
//                 }
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.animation_url.placeholder',
//                 )}
//                 helpText={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.animation_url.helpText',
//                 )}
//                 className="mb-4"
//               />

//               <InputText
//                 label={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.external_url.label',
//                 )}
//                 value={metadata.external_url ?? ''}
//                 onChange={(e) =>
//                   updateNftMetadata(nftIndex, 'external_url', e.target.value)
//                 }
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.external_url.placeholder',
//                 )}
//                 className="mb-4"
//               />

//               <InputText
//                 label={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.background_color.label',
//                 )}
//                 value={metadata.background_color ?? ''}
//                 onChange={(e) =>
//                   updateNftMetadata(nftIndex, 'background_color', e.target.value)
//                 }
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.background_color.placeholder',
//                 )}
//                 helpText={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.background_color.helpText',
//                 )}
//                 className="mb-4"
//               />

//               <InputText
//                 label={t('app.plugins.draw.createDrawForm.step2.nftMetadata.supply.label')}
//                 value={metadata.supply ?? 0}
//                 onChange={(e) => updateNftMetadata(nftIndex, 'supply', e.target.value)}
//                 placeholder={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.supply.placeholder',
//                 )}
//                 helpText={t(
//                   'app.plugins.draw.createDrawForm.step2.nftMetadata.supply.helpText',
//                 )}
//                 className="mb-4"
//               />

//               {/* Attributes Section */}
//               <div className="mb-3">
//                 <div className="mb-2 flex items-center justify-between">
//                   <label className="text-sm font-medium">
//                     {t(
//                       'app.plugins.draw.createDrawForm.step2.nftMetadata.attributes.label',
//                     )}
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => addAttribute(nftIndex)}
//                     className="text-sm text-blue-600 hover:text-blue-800"
//                   >
//                     {t(
//                       'app.plugins.draw.createDrawForm.step2.nftMetadata.attributes.addAction',
//                     )}
//                   </button>
//                 </div>

//                 {metadata.attributes.map((attr, attrIndex) => (
//                   <div key={attrIndex} className="mb-2 flex items-end gap-2">
//                     <InputText
//                       value={attr.trait_type}
//                       onChange={(e) =>
//                         updateAttribute(
//                           nftIndex,
//                           attrIndex,
//                           'trait_type',
//                           e.target.value,
//                         )
//                       }
//                       placeholder={t(
//                         'app.plugins.draw.createDrawForm.step2.nftMetadata.attributes.traitTypePlaceholder',
//                       )}
//                       className="flex-1"
//                     />
//                     <InputText
//                       value={
//                         typeof attr.value === 'number'
//                           ? attr.value.toString()
//                           : attr.value
//                       }
//                       onChange={(e) => {
//                         // Try to parse as number, otherwise keep as string
//                         const parsedValue = isNaN(Number(e.target.value))
//                           ? e.target.value
//                           : Number(e.target.value);
//                         updateAttribute(nftIndex, attrIndex, 'value', parsedValue);
//                       }}
//                       placeholder={t(
//                         'app.plugins.draw.createDrawForm.step2.nftMetadata.attributes.valuePlaceholder',
//                       )}
//                       className="flex-1"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeAttribute(nftIndex, attrIndex)}
//                       className="mb-2 text-sm text-red-600 hover:text-red-800"
//                     >
//                       {t(
//                         'app.plugins.draw.createDrawForm.step2.nftMetadata.attributes.removeAction',
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Collapsible>
//         </div>
//       ))}

//       <button
//         type="button"
//         onClick={addNftMetadata}
//         className="w-full rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
//       >
//         {t('app.plugins.draw.createDrawForm.step2.nftMetadata.addAction')}
//       </button>
//     </div>
//   );
// };