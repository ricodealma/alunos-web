import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-4">
                <div className="card">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Crie sua conta
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Preencha os dados abaixo para se cadastrar
                        </p>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
