'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Formato de email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        setError('');
        setLoading(true);

        try {
            await login(data.email, data.password);
            router.push('/students');
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Credenciais inválidas';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="seu@email.com"
                    disabled={loading}
                />
                {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                </label>
                <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="••••••••"
                    disabled={loading}
                />
                {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Entrando...
                    </span>
                ) : (
                    'Entrar'
                )}
            </button>

            <div className="text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Cadastre-se
                </Link>
            </div>
        </form>
    );
}
