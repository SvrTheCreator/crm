import { useForm } from 'react-hook-form';
import type { UserType } from '../types.ts';
import { useState } from 'react';
import { loginUser } from '../api.ts';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router';

const demoUser = {
    email: 'demo@demo.com',
    password: 'demo123456',
};

export function LoginForm() {
    const { register, reset, handleSubmit } = useForm<UserType>();
    const [error, setError] = useState('');

    async function handleLogin(user: UserType) {
        setError('');

        const userData = {
            email: user.email,
            password: user.password,
        };

        const { error } = await loginUser(userData);
        if (error !== null) {
            setError(error.message);
            return;
        }

        reset();
        return;
    }

    async function handleDemoLogin() {
        setError('');

        const { error } = await loginUser(demoUser);
        if (error !== null) {
            setError(error.message);
        }
    }

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(handleLogin)}>
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
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                {/*<a*/}
                                {/*    href="#"*/}
                                {/*    className="ml-auto text-sm underline-offset-4 hover:underline"*/}
                                {/*>*/}
                                {/*    Forgot your password?*/}
                                {/*</a>*/}
                            </div>
                            <Input
                                {...register('password', { required: true })}
                                id="password"
                                type="password"
                                required
                            />
                        </Field>
                        <Field>
                            <Button type="submit">Login</Button>
                            <Button type="button" variant="outline" onClick={handleDemoLogin}>
                                Try demo
                            </Button>
                            {error && (
                                <FieldDescription className="caret-pink-900">
                                    {error}
                                </FieldDescription>
                            )}
                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <Link to="/register">Sign up</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
