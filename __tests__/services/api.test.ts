import axios from 'axios';
import { redirectToLogin } from '@/lib/authUtils';

// Mock axios methods and creation
const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();

jest.mock('axios', () => {
    return {
        create: jest.fn(() => ({
            interceptors: {
                request: { use: mockRequestUse },
                response: { use: mockResponseUse },
            },
            get: jest.fn(),
            post: jest.fn(),
        })),
        isAxiosError: jest.fn(),
    };
});

// Mock authUtils
jest.mock('@/lib/authUtils', () => ({
    redirectToLogin: jest.fn(),
}));

describe('API Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.isolateModules(() => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require('@/services/api');
        });

        // Mock localStorage
        const localStorageMock = (function () {
            let store: { [key: string]: string } = {};
            return {
                getItem: jest.fn((key: string) => store[key] || null),
                setItem: jest.fn((key: string, value: string) => {
                    store[key] = value.toString();
                }),
                removeItem: jest.fn((key: string) => {
                    delete store[key];
                }),
                clear: jest.fn(() => {
                    store = {};
                })
            };
        })();
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
        });
    });

    describe('Configuration', () => {
        it('should create axios instance with default config', () => {
            expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
            }));
        });
    });

    describe('Request Interceptor', () => {
        it('should add Authorization header if token exists', () => {
            const [successHandler] = mockRequestUse.mock.calls[0];

            window.localStorage.setItem('authToken', 'test-token');

            const config = { headers: {} };
            const result = successHandler(config);

            expect(result.headers.Authorization).toBe('Bearer test-token');
        });

        it('should not add Authorization header if token is missing', () => {
            const [successHandler] = mockRequestUse.mock.calls[0];

            (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

            const config = { headers: {} };
            const result = successHandler(config);

            expect(result.headers.Authorization).toBeUndefined();
        });
    });

    describe('Response Interceptor', () => {
        it('should return response on success', () => {
            const [successHandler] = mockResponseUse.mock.calls[0];
            const response = { data: 'success' };
            expect(successHandler(response)).toBe(response);
        });

        it('should handle 401 error by clearing storage and calling redirectToLogin', async () => {
            const [, errorHandler] = mockResponseUse.mock.calls[0];

            const error = {
                response: { status: 401 }
            };

            try {
                await errorHandler(error);
            } catch (e) {
                expect(e).toBe(error);
            }

            expect(window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
            expect(window.localStorage.removeItem).toHaveBeenCalledWith('userEmail');
            expect(redirectToLogin).toHaveBeenCalled();
        });
    });
});
