'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Student, PaginatedResponse } from '@/types';
import StudentList from '@/components/StudentList';
import StudentForm from '@/components/StudentForm';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function StudentsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch students
    useEffect(() => {
        if (isAuthenticated) {
            fetchStudents(currentPage);
        }
    }, [currentPage, isAuthenticated]);

    const fetchStudents = async (page: number) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get<PaginatedResponse<Student>>(`/v1/alunos?page=${page}&size=10`);
            setStudents(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || 'Erro ao carregar alunos';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddSuccess = () => {
        setShowAddForm(false);
        setSuccessMessage('Aluno adicionado com sucesso!');
        fetchStudents(1);
        setCurrentPage(1);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDelete = (student: Student) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!studentToDelete) return;

        setDeleteLoading(true);
        setError('');

        try {
            await api.delete(`/v1/alunos/${studentToDelete.id}`);
            setShowDeleteModal(false);
            setStudentToDelete(null);
            setSuccessMessage('Aluno excluído com sucesso!');
            fetchStudents(currentPage);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            const error = err as { response?: { status? : number, data?: { message?: string } } };
            let errorMessage = 'Erro ao excluir aluno';

            if (error.response?.status === 404) {
                errorMessage = 'Aluno não encontrado. A lista foi atualizada.';
                fetchStudents(currentPage);
            } else {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
            setShowDeleteModal(false);
            setStudentToDelete(null);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setStudentToDelete(null);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Gestão de Alunos
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Logado como: {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                        ✓ {successMessage}
                    </div>
                )}

                {/* Add Student Form */}
                {showAddForm && (
                    <div className="mb-6">
                        <StudentForm
                            onSuccess={handleAddSuccess}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </div>
                )}

                {/* Students List */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Lista de Alunos
                        </h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn-primary"
                        >
                            {showAddForm ? '✕ Cancelar' : '+ Adicionar Aluno'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                            <button
                                onClick={() => fetchStudents(currentPage)}
                                className="ml-2 underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    <StudentList
                        students={students}
                        loading={loading}
                        onDelete={handleDelete}
                    />

                    {!loading && students.length > 0 && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                isOpen={showDeleteModal}
                studentName={studentToDelete?.nome || ''}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
            />
        </div>
    );
}
