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

    const handleRegister = (data: CreateUserType) => {
        setError('');
        if (data.password !== data.confirm_password) {
            setError('Passwords do not match');
            return;
        }
        const newUser = {
            email: data.email,
            password: data.password,
            confirm_password: data.confirm_password,
        };

        registerUser(newUser);

        reset();
    };

    return (
        <div style={style}>
            <h2>Register form</h2>
            <form onSubmit={handleSubmit(handleRegister)}>
                {/*<div>*/}
                {/*    <label htmlFor="first-name">First name:</label>*/}
                {/*    <input id="first-name" type="text" />*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    <label htmlFor="second-name">Second name:</label>*/}
                {/*    <input id='second-name"' type="text" />*/}
                {/*</div>*/}
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
                        style={{ border: error ? '1px solid red' : '1px solid white' }}
                        {...register('confirm_password', { required: true })}
                        id="confirm-password"
                        type="password"
                    />
                    {error}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
