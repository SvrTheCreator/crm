import { useForm } from 'react-hook-form';
import type { CreateUserType } from '../types.ts';
import { registerUser } from '../api.ts';
import { useState } from 'react';

const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
} as const;

export function RegisterForm() {
    const { register, reset, handleSubmit } = useForm<CreateUserType>();
    const [error, setError] = useState('');

    async function handleRegister(user: CreateUserType) {
        setError('');
        if (user.password !== user.confirm_password) {
            setError('Passwords do not match');
            return;
        }
        const newUser = {
            email: user.email,
            password: user.password,
            confirm_password: user.confirm_password,
            first_name: user.first_name,
            last_name: user.last_name,
            user_avatar: '/user_default_avatar.png',
        };

        const { data, error } = await registerUser(newUser);
        if (error !== null) {
            setError(error.message);
            return;
        }
        // отрабатывает если поставить подтверждение email
        if (data.user?.identities?.length === 0) {
            // console.log(data.user?.identities);
            setError('Пользователь с таким email уже существует');
            return;
        }
        reset();
        return;
    }

    return (
        <div style={style}>
            <h2>Register form</h2>
            <form onSubmit={handleSubmit(handleRegister)}>
                <div>
                    <label htmlFor="email">User email:</label>
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
                <div>
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        {...register('confirm_password', { required: true })}
                        id="confirm-password"
                        type="password"
                    />
                </div>
                <div>
                    <label htmlFor="first-name">First name:</label>
                    <input
                        {...register('first_name', { required: true })}
                        id="first-name"
                        type="text"
                    />
                </div>
                <div>
                    <label htmlFor="second-name">Second name:</label>
                    <input
                        {...register('last_name', { required: true })}
                        id='second-name"'
                        type="text"
                    />
                </div>
                <button type="submit">Register</button>
                <div>{error}</div>
            </form>
        </div>
    );
}
