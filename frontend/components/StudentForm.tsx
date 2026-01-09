'use client';

import { useState, FormEvent } from 'react';
import api from '@/services/api';

interface StudentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function StudentForm({ onSuccess, onCancel }: StudentFormProps) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [serie, setSerie] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }

        if (!email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Formato de email inválido';
        }

        if (!serie.trim()) {
            newErrors.serie = 'Série é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            await api.post('/v1/alunos', {
                nome: nome.trim(),
                email: email.trim(),
                serie: serie.trim(),
            });

            // Success
            setNome('');
            setEmail('');
            setSerie('');
            onSuccess();
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || 'Erro ao adicionar aluno';
            setErrors({ general: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Adicionar Novo Aluno
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                    </label>
                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="input-field"
                        placeholder="João Silva"
                        disabled={loading}
                    />
                    {errors.nome && (
                        <p className="text-red-600 text-sm mt-1">{errors.nome}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="joao@email.com"
                        disabled={loading}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="serie" className="block text-sm font-medium text-gray-700 mb-1">
                        Série
                    </label>
                    <input
                        id="serie"
                        type="text"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value)}
                        className="input-field"
                        placeholder="5ª série"
                        disabled={loading}
                    />
                    {errors.serie && (
                        <p className="text-red-600 text-sm mt-1">{errors.serie}</p>
                    )}
                </div>

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {errors.general}
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
