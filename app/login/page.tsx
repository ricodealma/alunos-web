import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-4">
                <div className="card">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sistema de Alunos
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Faça login para continuar
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
