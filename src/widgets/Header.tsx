import { useState } from 'react';
import { LoginForm } from '../features/auth/components/LoginForm.tsx';
import { RegisterForm } from '../features/auth/components/RegisterForm.tsx';
import { signOut } from '../features/auth/api.ts';
import { useAuth } from '../features/auth/hooks/AuthContext.ts';

const styleForm = {
    position: 'absolute',
    top: '10%',
    left: '16px',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1f2028',
    display: 'flex',
    justifyContent: 'center',
    zIndex: '10',
} as const;

// type Props = {
//     loading: boolean;
//     currentUser: string | null;
//     setCurrentUser: (value: string | null) => void;
// };

export function Header() {
    const [currentForm, setCurrentForm] = useState('');
    const { currentUser, setCurrentUser, loading } = useAuth();

    const loginForm = 'Login Form';
    const registerForm = 'Register Form';

    const handleVariable = (el: string) => {
        setCurrentForm((prevState) => {
            if (el === prevState) {
                return '';
            }
            return el;
        });
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>header</div>

            <div>
                {loading ? (
                    <div>Loading...</div>
                ) : currentUser !== null ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div>{currentUser}</div>
                        <div>
                            <button
                                onClick={() => {
                                    signOut();
                                    setCurrentUser(null);
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => handleVariable(loginForm)}>Войти</button>
                        <button onClick={() => handleVariable(registerForm)}>Регистрация</button>
                    </div>
                )}
            </div>

            {currentForm === loginForm && (
                <div style={styleForm}>
                    <LoginForm />
                </div>
            )}
            {currentForm === registerForm && (
                <div style={styleForm}>
                    <RegisterForm />
                </div>
            )}
        </header>
    );
}
