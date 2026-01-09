import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Student, PaginatedResponse } from '@/types';

export const useStudents = (page: number, size: number = 10) => {
    return useQuery({
        queryKey: ['students', { page, size }],
        queryFn: async () => {
            const response = await api.get<PaginatedResponse<Student>>(`/v1/alunos?page=${page}&size=${size}`);
            return response.data;
        },
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newStudent: Omit<Student, 'id'>) => {
            const response = await api.post<Student>('/v1/alunos', newStudent);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch students list on page 1
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (studentId: number) => {
            await api.delete(`/v1/alunos/${studentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });
};
