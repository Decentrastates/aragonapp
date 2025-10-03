import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useDao } from '@/shared/api/daoService';
import type {
    ICheckEligibilityRequest,
    ICheckEligibilityResponse,
    IGetDrawHistoryRequest,
    IGetDrawHistoryResponse,
    IGetNftHoldingsRequest,
    IGetNftHoldingsResponse,
    IGetRedemptionRequirementsRequest,
    IGetRedemptionRequirementsResponse,
    IRequestDrawRequest,
    IRequestDrawResponse,
    IRedeemNftsRequest,
    IRedeemNftsResponse,
    IGetPluginSettingsRequest,
    IGetPluginSettingsResponse,
    IUpdateEligibilityParamRequest,
    IUpdateEligibilityParamResponse,
    IUpdateBlacklistRequest,
    IUpdateBlacklistResponse,
    IUpdateNFTComboRequest,
    IUpdateNFTComboResponse,
    ISetNFTMaxSupplyRequest,
    ISetNFTMaxSupplyResponse,
    IGetValidNftIdsRequest,
    IGetValidNftIdsResponse,
    IGetNftSupplyRequest,
    IGetNftSupplyResponse,
} from './drawService.api';
import { MockDrawApiService } from './mockDrawApiService';

// 检查是否使用模拟数据
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DRAW_DATA === 'true';

// Create a singleton instance for mock service
const mockDrawApiService = new MockDrawApiService();

// API service implementation
export class DrawApiService {
    private baseUrl: string;
    
    constructor(baseUrl = '/api/draw') {
        this.baseUrl = baseUrl;
    }
    
    // Utility method to make HTTP requests
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // 如果使用模拟数据，直接返回
        if (USE_MOCK_DATA) {
            // 这里应该根据endpoint返回相应的模拟数据
            // 但在实际实现中，我们会使用mockDrawApiService
            throw new Error('Mock data should be handled by mockDrawApiService');
        }
        
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...Object.fromEntries(Object.entries(options.headers ?? {})),
            },
            ...options,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${String(response.status)}`);
        }
        
        const data: unknown = await response.json();
        return data as T;
    }
    
    /**
     * Check if user is eligible for drawing
     */
    checkEligibility = async (params: ICheckEligibilityRequest): Promise<ICheckEligibilityResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.checkEligibility(params);
            return result as unknown as ICheckEligibilityResponse;
        }
        
        return this.request<ICheckEligibilityResponse>(`/eligibility`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Get user's draw history
     */
    getDrawHistory = async (params: IGetDrawHistoryRequest): Promise<IGetDrawHistoryResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.getDrawHistory(params);
            return result as unknown as IGetDrawHistoryResponse;
        }
        
        const { daoAddress, userAddress, page, limit } = params;
        return this.request<IGetDrawHistoryResponse>(`/history?daoAddress=${encodeURIComponent(daoAddress)}&userAddress=${encodeURIComponent(userAddress)}&page=${String(page)}&limit=${String(limit)}`);
    };
    
    /**
     * Get user's NFT holdings
     */
    getNftHoldings = async (params: IGetNftHoldingsRequest): Promise<IGetNftHoldingsResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.getNftHoldings(params);
            return result as unknown as IGetNftHoldingsResponse;
        }
        
        const { daoAddress, userAddress } = params;
        return this.request<IGetNftHoldingsResponse>(`/nft-holdings?daoAddress=${encodeURIComponent(daoAddress)}&userAddress=${encodeURIComponent(userAddress)}`);
    };
    
    /**
     * Get redemption requirements
     */
    getRedemptionRequirements = async (params: IGetRedemptionRequirementsRequest): Promise<IGetRedemptionRequirementsResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.getRedemptionRequirements(params);
            return result as unknown as IGetRedemptionRequirementsResponse;
        }
        
        const { daoAddress } = params;
        return this.request<IGetRedemptionRequirementsResponse>(`/redemption-requirements?daoAddress=${encodeURIComponent(daoAddress)}`);
    };
    
    /**
     * Request a draw
     */
    requestDraw = async (params: IRequestDrawRequest): Promise<IRequestDrawResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.requestDraw(params);
            return result as unknown as IRequestDrawResponse;
        }
        
        return this.request<IRequestDrawResponse>(`/request-draw`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Redeem NFTs for tokens
     */
    redeemNfts = async (params: IRedeemNftsRequest): Promise<IRedeemNftsResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.redeemNfts(params);
            return result as unknown as IRedeemNftsResponse;
        }
        
        return this.request<IRedeemNftsResponse>(`/redeem-nfts`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Get plugin settings
     */
    getPluginSettings = async (params: IGetPluginSettingsRequest): Promise<IGetPluginSettingsResponse> => {
        if (USE_MOCK_DATA) {
            const result = await mockDrawApiService.getPluginSettings(params);
            return result as unknown as IGetPluginSettingsResponse;
        }
        
        const { daoAddress } = params;
        return this.request<IGetPluginSettingsResponse>(`/settings?daoAddress=${encodeURIComponent(daoAddress)}`);
    };
    
    /**
     * Update eligibility parameter
     */
    updateEligibilityParam = async (params: IUpdateEligibilityParamRequest): Promise<IUpdateEligibilityParamResponse> => {
        if (USE_MOCK_DATA) {
            // 模拟数据不需要实现更新操作
            return Promise.resolve({ success: true } as unknown as IUpdateEligibilityParamResponse);
        }
        
        return this.request<IUpdateEligibilityParamResponse>(`/update-eligibility-param`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Update blacklist
     */
    updateBlacklist = async (params: IUpdateBlacklistRequest): Promise<IUpdateBlacklistResponse> => {
        if (USE_MOCK_DATA) {
            // 模拟数据不需要实现更新操作
            return Promise.resolve({ success: true } as unknown as IUpdateBlacklistResponse);
        }
        
        return this.request<IUpdateBlacklistResponse>(`/update-blacklist`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Update NFT combo
     */
    updateNFTCombo = async (params: IUpdateNFTComboRequest): Promise<IUpdateNFTComboResponse> => {
        if (USE_MOCK_DATA) {
            // 模拟数据不需要实现更新操作
            return Promise.resolve({ success: true } as unknown as IUpdateNFTComboResponse);
        }
        
        return this.request<IUpdateNFTComboResponse>(`/update-nft-combo`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Set NFT max supply
     */
    setNFTMaxSupply = async (params: ISetNFTMaxSupplyRequest): Promise<ISetNFTMaxSupplyResponse> => {
        if (USE_MOCK_DATA) {
            // 模拟数据不需要实现更新操作
            return Promise.resolve({ success: true } as unknown as ISetNFTMaxSupplyResponse);
        }
        
        return this.request<ISetNFTMaxSupplyResponse>(`/set-nft-max-supply`, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    };
    
    /**
     * Get valid NFT IDs
     */
    getValidNftIds = async (params: IGetValidNftIdsRequest): Promise<IGetValidNftIdsResponse> => {
        if (USE_MOCK_DATA) {
            // 返回模拟的NFT ID列表
            const result = await mockDrawApiService.getValidNftIds(params);
            return result as unknown as IGetValidNftIdsResponse;
        }
        
        const { daoAddress, pluginAddress } = params;
        return this.request<IGetValidNftIdsResponse>(`/valid-nft-ids?daoAddress=${encodeURIComponent(daoAddress)}&pluginAddress=${encodeURIComponent(pluginAddress)}`);
    };
    
    /**
     * Get NFT supply
     */
    getNftSupply = async (params: IGetNftSupplyRequest): Promise<IGetNftSupplyResponse> => {
        if (USE_MOCK_DATA) {
            // 返回模拟的供应量数据
            const result = await mockDrawApiService.getNftSupply(params);
            return result as unknown as IGetNftSupplyResponse;
        }
        
        const { daoAddress, pluginAddress, nftId } = params;
        return this.request<IGetNftSupplyResponse>(`/nft-supply?daoAddress=${encodeURIComponent(daoAddress)}&pluginAddress=${encodeURIComponent(pluginAddress)}&nftId=${encodeURIComponent(nftId)}`);
    };
}

// Create a singleton instance
export const drawApiService = new DrawApiService();

// React Query hooks
export const useDrawEligibility = (daoId: string) => {
    const { address: userAddress } = useAccount();
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['drawEligibility', daoId, userAddress],
        queryFn: () => drawApiService.checkEligibility({
            daoAddress: dao!.address,
            userAddress: userAddress!
        }),
        enabled: !!(dao?.address && userAddress),
    });
};

export const useDrawHistory = (daoId: string, page = 1, limit = 10) => {
    const { address: userAddress } = useAccount();
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['drawHistory', daoId, userAddress, page, limit],
        queryFn: () => drawApiService.getDrawHistory({
            daoAddress: dao!.address,
            userAddress: userAddress!,
            page,
            limit
        }),
        enabled: !!(dao?.address && userAddress),
    });
};

export const useNftHoldings = (daoId: string) => {
    const { address: userAddress } = useAccount();
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['nftHoldings', daoId, userAddress],
        queryFn: () => drawApiService.getNftHoldings({
            daoAddress: dao!.address,
            userAddress: userAddress!
        }),
        enabled: !!(dao?.address && userAddress),
    });
};

export const useRedemptionRequirements = (daoId: string) => {
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['redemptionRequirements', daoId],
        queryFn: () => drawApiService.getRedemptionRequirements({
            daoAddress: dao!.address
        }),
        enabled: !!dao?.address,
    });
};

export const useRequestDraw = (daoId: string) => {
    const queryClient = useQueryClient();
    const { address: userAddress } = useAccount();
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useMutation({
        mutationFn: () => drawApiService.requestDraw({
            daoAddress: dao!.address,
            userAddress: userAddress!
        }),
        onSuccess: () => {
            // Invalidate and refetch queries
            void queryClient.invalidateQueries({ queryKey: ['drawEligibility', daoId, userAddress] });
            void queryClient.invalidateQueries({ queryKey: ['drawHistory', daoId, userAddress] });
        },
    });
};

export const useRedeemNfts = (daoId: string) => {
    const queryClient = useQueryClient();
    const { address: userAddress } = useAccount();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useMutation({
        mutationFn: ({ nftIds }: { nftIds: string[] }) => drawApiService.redeemNfts({
            daoAddress: dao!.address,
            userAddress: userAddress!,
            nftIds
        }),
        onSuccess: () => {
            // Invalidate and refetch queries
            void queryClient.invalidateQueries({ queryKey: ['nftHoldings', daoId, userAddress] });
        },
    });
};

// Additional hooks for Draw Plugin management
export const useUpdateEligibilityParam = (daoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useMutation({
        mutationFn: ({ pluginAddress, paramName, newValue }: { pluginAddress: string; paramName: string; newValue: string }) => 
            drawApiService.updateEligibilityParam({
                daoAddress: dao!.address,
                pluginAddress,
                paramName,
                newValue
            }),
    });
};

export const useUpdateBlacklist = (daoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useMutation({
        mutationFn: ({ pluginAddress, users, isBlacklisted }: { pluginAddress: string; users: string[]; isBlacklisted: boolean }) => 
            drawApiService.updateBlacklist({
                daoAddress: dao!.address,
                pluginAddress,
                users,
                isBlacklisted
            }),
    });
};

export const useUpdateNFTCombo = (daoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useMutation({
        mutationFn: (params: IUpdateNFTComboRequest) => 
            drawApiService.updateNFTCombo(params),
    });
};

export const useSetNFTMaxSupply = (daoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useMutation({
        mutationFn: ({ pluginAddress, nftId, maxSupply }: { pluginAddress: string; nftId: string; maxSupply: string }) => 
            drawApiService.setNFTMaxSupply({
                daoAddress: dao!.address,
                pluginAddress,
                nftId,
                maxSupply
            }),
    });
};

export const useValidNftIds = (daoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['validNftIds', daoId],
        queryFn: () => drawApiService.getValidNftIds({
            daoAddress: dao!.address,
            pluginAddress: dao!.plugins[0]?.address || ''
        }),
        enabled: !!(dao?.address && dao.plugins[0]?.address),
    });
};

export const useNftSupply = (daoId: string, nftId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['nftSupply', daoId, nftId],
        queryFn: () => drawApiService.getNftSupply({
            daoAddress: dao!.address,
            pluginAddress: dao!.plugins[0]?.address || '',
            nftId
        }),
        enabled: !!(dao?.address && dao.plugins[0]?.address),
    });
};

// Plugin settings hook
export const usePluginSettings = (daoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: dao } = useDao({ urlParams: { id: daoId } });
    
    return useQuery({
        queryKey: ['pluginSettings', daoId],
        queryFn: () => drawApiService.getPluginSettings({
            daoAddress: dao!.address
        }),
        enabled: !!dao?.address,
    });
};