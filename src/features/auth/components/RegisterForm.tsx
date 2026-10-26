import { useForm } from 'react-hook-form';
import type { CreateUserType } from '../types.ts';
import { registerUser } from '../api.ts';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router';

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
            setError('Пользователь с таким email уже существует');
            return;
        }
        reset();
        return;
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(handleRegister)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                {...register('email', { required: true })}
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                {...register('password', { required: true })}
                                id="password"
                                type="password"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                            <Input
                                {...register('confirm_password', { required: true })}
                                id="confirm-password"
                                type="password"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="first-name">First name</FieldLabel>
                            <Input
                                {...register('first_name', { required: true })}
                                id="first-name"
                                type="text"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="second-name">Second name</FieldLabel>
                            <Input
                                {...register('last_name', { required: true })}
                                id="second-name"
                                type="text"
                                required
                            />
                        </Field>
                        <Field>
                            <Button type="submit">Register</Button>
                            {error && (
                                <FieldDescription className="caret-pink-900">
                                    {error}
                                </FieldDescription>
                            )}
                            <FieldDescription className="text-center">
                                Already have an account? <Link to="/login">Login</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
