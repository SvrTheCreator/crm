import { useForm } from 'react-hook-form';
import type { UserType } from '../types.ts';
import { useState } from 'react';
import { loginUser } from '../api.ts';

const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
} as const;

export function LoginForm() {
    const { register, reset, handleSubmit } = useForm<UserType>();
    const [error, setError] = useState('');

    async function handleLogin(user: UserType) {
        setError('');

        const userData = {
            email: user.email,
            password: user.password,
        };

        const { data, error } = await loginUser(userData);
        if (error !== null) {
            setError(error.message);
            return;
        }
        console.log(data);

        reset();
        return;
    }

    return (
        <div style={style}>
            <h2>Login form</h2>
            <form onSubmit={handleSubmit(handleLogin)}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input {...register('email', { required: true })} id="email" type="email" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        {...register('password', { required: true })}
                        id="password"
                        type="password"
                    />
                </div>
                <button type="submit">Sign In</button>
                <div>{error}</div>
            </form>
        </div>
    );
}
