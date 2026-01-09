'use client';

import { useState } from 'react';
import api from '@/services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const studentSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
    serie: z.string().min(1, 'Série é obrigatória'),
});

type StudentSchema = z.infer<typeof studentSchema>;

interface StudentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function StudentForm({ onSuccess, onCancel }: StudentFormProps) {
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema),
    });

    const onSubmit = async (data: StudentSchema) => {
        setLoading(true);
        setGeneralError('');

        try {
            await api.post('/v1/alunos', {
                nome: data.nome.trim(),
                email: data.email.trim(),
                serie: data.serie.trim(),
            });

            // Success
            reset();
            onSuccess();
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || 'Erro ao adicionar aluno';
            setGeneralError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Adicionar Novo Aluno
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                    </label>
                    <input
                        id="nome"
                        type="text"
                        {...register('nome')}
                        className={`input-field ${errors.nome ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="João Silva"
                        disabled={loading}
                    />
                    {errors.nome && (
                        <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="joao@email.com"
                        disabled={loading}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="serie" className="block text-sm font-medium text-gray-700 mb-1">
                        Série
                    </label>
                    <input
                        id="serie"
                        type="text"
                        {...register('serie')}
                        className={`input-field ${errors.serie ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="5ª série"
                        disabled={loading}
                    />
                    {errors.serie && (
                        <p className="text-red-600 text-sm mt-1">{errors.serie.message}</p>
                    )}
                </div>

                {generalError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {generalError}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary flex-1"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-primary flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
