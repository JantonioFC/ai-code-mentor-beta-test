
import { ProviderFactory } from '../../lib/ai/providers/ProviderFactory';
import { GeminiProvider } from '../../lib/ai/providers/GeminiProvider';
import { MockProvider } from '../../lib/ai/providers/MockProvider';

// Mock Providers
jest.mock('../../lib/ai/providers/GeminiProvider');
jest.mock('../../lib/ai/providers/MockProvider');

describe('ProviderFactory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.USE_MOCK_AI = 'false';
    });

    it('should return MockProvider if USE_MOCK_AI is true', () => {
        process.env.USE_MOCK_AI = 'true';
        ProviderFactory.getProvider('gemini');
        expect(MockProvider).toHaveBeenCalled();
    });

    it('should return GeminiProvider for "gemini" if available', () => {
        GeminiProvider.mockImplementation(() => ({
            isAvailable: () => true
        }));

        const provider = ProviderFactory.getProvider('gemini');
        expect(GeminiProvider).toHaveBeenCalled();
    });

    it('should fallback to MockProvider if Gemini not available', () => {
        GeminiProvider.mockImplementation(() => ({
            isAvailable: () => false
        }));

        ProviderFactory.getProvider('gemini');
        expect(MockProvider).toHaveBeenCalled();
    });

    it('should return MockProvider for "mock"', () => {
        ProviderFactory.getProvider('mock');
        expect(MockProvider).toHaveBeenCalled();
    });
});
