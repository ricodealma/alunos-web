interface DeleteConfirmationProps {
    isOpen: boolean;
    studentName: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

export default function DeleteConfirmation({
    isOpen,
    studentName,
    onConfirm,
    onCancel,
    loading,
}: DeleteConfirmationProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Confirmar Exclusão
                </h3>
                <p className="text-gray-600 mb-6">
                    Tem certeza que deseja excluir o aluno <strong>{studentName}</strong>?
                    Esta ação não pode ser desfeita.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="btn-secondary flex-1"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn-danger flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
}
