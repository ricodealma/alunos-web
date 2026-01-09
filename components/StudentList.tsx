import { Student } from '@/types';
import LoadingSpinner from './LoadingSpinner';

interface StudentListProps {
    students: Student[];
    loading: boolean;
    onDelete: (student: Student) => void;
}

export default function StudentList({ students, loading, onDelete }: StudentListProps) {
    if (loading) {
        return (
            <div className="py-12">
                <LoadingSpinner />
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum aluno cadastrado</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Série
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.nome}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.serie}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                    onClick={() => onDelete(student)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                >
                                    🗑️ Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {students.map((student) => (
                    <div key={student.id} className="card">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-sm text-gray-500">ID: {student.id}</p>
                                <h3 className="text-lg font-semibold text-gray-900">{student.nome}</h3>
                            </div>
                            <button
                                onClick={() => onDelete(student)}
                                className="text-red-600 hover:text-red-800"
                            >
                                🗑️
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">📧 {student.email}</p>
                        <p className="text-sm text-gray-900">📚 {student.serie}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
