import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents, useCreateStudent, useDeleteStudent } from '@/hooks/useStudents';
import api from '@/services/api';
import { Student } from '@/types';

// Mock api module
jest.mock('@/services/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'TestWrapper';
    return Wrapper;
};

describe('Hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useStudents', () => {
        it('should fetch students successfully', async () => {
            const mockData = {
                data: [{ id: 1, name: 'Student 1' }],
                total: 1,
                page: 1,
                size: 10
            };

            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const { result } = renderHook(() => useStudents(1), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(api.get).toHaveBeenCalledWith('/v1/alunos?page=1&size=10');
            expect(result.current.data).toEqual(mockData);
        });
    });

    describe('useCreateStudent', () => {
        it('should create student successfully', async () => {
            const newStudent = { name: 'New Student', email: 'test@example.com', cpf: '123', nome: 'New Student', serie: '1ª Série' };
            const responseData = { id: 1, ...newStudent };

            (api.post as jest.Mock).mockResolvedValue({ data: responseData });

            const { result } = renderHook(() => useCreateStudent(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(newStudent as Omit<Student, "id">);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(api.post).toHaveBeenCalledWith('/v1/alunos', newStudent);
        });
    });

    describe('useDeleteStudent', () => {
        it('should delete student successfully', async () => {
            (api.delete as jest.Mock).mockResolvedValue({});

            const { result } = renderHook(() => useDeleteStudent(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(api.delete).toHaveBeenCalledWith('/v1/alunos/1');
        });
    });
});
