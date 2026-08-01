import { useState } from 'react';
import { LoginForm } from '../features/auth/components/LoginForm.tsx';
import { RegisterForm } from '../features/auth/components/RegisterForm.tsx';

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

export function Header() {
    const [currentForm, setCurrentForm] = useState('');

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
    console.log(currentForm);

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>header</div>
            <div>
                <button onClick={() => handleVariable(loginForm)}>Войти</button>
                <button onClick={() => handleVariable(registerForm)}>Регистрация</button>
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
