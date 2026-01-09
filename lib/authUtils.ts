export const redirectToLogin = () => {
    if (typeof window !== 'undefined') {
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
        }
    }
};
