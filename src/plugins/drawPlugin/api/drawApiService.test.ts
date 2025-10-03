import { drawApiService } from './drawApiService';

// Mock fetch globally
global.fetch = jest.fn();

describe('DrawApiService', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should create DrawApiService instance', () => {
        expect(drawApiService).toBeInstanceOf(drawApiService.constructor);
    });

    it('should have all required methods', () => {
        expect(typeof drawApiService.checkEligibility).toBe('function');
        expect(typeof drawApiService.getDrawHistory).toBe('function');
        expect(typeof drawApiService.getNftHoldings).toBe('function');
        expect(typeof drawApiService.getRedemptionRequirements).toBe('function');
        expect(typeof drawApiService.requestDraw).toBe('function');
        expect(typeof drawApiService.redeemNfts).toBe('function');
        expect(typeof drawApiService.getPluginSettings).toBe('function');
        expect(typeof drawApiService.updateEligibilityParam).toBe('function');
        expect(typeof drawApiService.updateBlacklist).toBe('function');
        expect(typeof drawApiService.updateNFTCombo).toBe('function');
        expect(typeof drawApiService.setNFTMaxSupply).toBe('function');
        expect(typeof drawApiService.getValidNftIds).toBe('function');
        expect(typeof drawApiService.getNftSupply).toBe('function');
    });

    it('should construct correct URLs', () => {
        const service = new (drawApiService.constructor as new (baseUrl: string) => typeof drawApiService)('/test-api');
        expect((service as any).baseUrl).toBe('/test-api');
    });
});