import { useForm } from 'react-hook-form';
import type { UserType } from '../types.ts';
import { useState } from 'react';
import { loginUser } from '../api.ts';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router';

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
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit(handleLogin)}>
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
                        {error && (
                            <FieldDescription className="caret-pink-900">{error}</FieldDescription>
                        )}
                        <FieldDescription className="text-center">
                            Don&apos;t have an account? <Link to="/register">Sign up</Link>
                        </FieldDescription>
                    </Field>

                    {/*<div>*/}
                    {/*    <label htmlFor="email">Email:</label>*/}
                    {/*    <input {...register('email', { required: true })} id="email" type="email" />*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <label htmlFor="password">Password:</label>*/}
                    {/*    <input*/}
                    {/*        {...register('password', { required: true })}*/}
                    {/*        id="password"*/}
                    {/*        type="password"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<button type="submit">Sign In</button>*/}
                    {/*<div>{error}</div>*/}
                </form>
            </CardContent>
        </Card>
    );
}
