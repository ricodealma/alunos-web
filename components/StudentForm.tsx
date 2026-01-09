'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateStudent } from '@/hooks/useStudents';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

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
    const [generalError, setGeneralError] = useState('');
    const createMutation = useCreateStudent();

    const form = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            nome: "",
            email: "",
            serie: "",
        },
    });

    const onSubmit = async (data: StudentSchema) => {
        setGeneralError('');

        try {
            await createMutation.mutateAsync({
                nome: data.nome.trim(),
                email: data.email.trim(),
                serie: data.serie.trim(),
            });

            // Success
            form.reset();
            onSuccess();
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || 'Erro ao adicionar aluno';
            setGeneralError(errorMessage);
        }
    };

    const loading = createMutation.isPending;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Novo Aluno</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="João Silva" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="joao@email.com" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serie"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Série</FormLabel>
                                    <FormControl>
                                        <Input placeholder="5ª série" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {generalError && (
                            <div className="bg-destructive/15 border border-destructive/50 text-destructive px-4 py-3 rounded text-sm">
                                {generalError}
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onCancel}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
