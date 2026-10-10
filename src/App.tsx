import { Workspace } from './pages/workspace/Workspace.tsx';
import { useEffect, useState } from 'react';
import { AuthContext } from './features/auth/hooks/AuthContext.ts';
import { supabase } from './shared/utils/supabase.ts';
import type { User } from '@supabase/supabase-js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { RegisterForm } from './features/auth/components/RegisterForm.tsx';
import { LoginForm } from './features/auth/components/LoginForm.tsx';
import { TaskList } from './features/tasks/components/TaskList.tsx';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute.tsx';
import { GuestRoute } from './features/auth/components/GuestRoute.tsx';
import { NotFound } from './pages/notFound/NotFound.tsx';
import { Toaster } from '@/components/ui/toast';
import { AuthLayout } from '@/pages/auth/AuthLayout.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';

export function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setCurrentUser(session?.user ?? null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <AuthContext.Provider value={{ currentUser, loading }}>
                    <main>
                        <Routes>
                            <Route path="/" element={<Navigate to="/projects" replace />} />
                            <Route path="*" element={<NotFound />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/projects" element={<Workspace />}>
                                    <Route
                                        index
                                        element={
                                            <div className="flex min-w-100">
                                                <h2>Select Project</h2>
                                            </div>
                                        }
                                    />
                                    <Route path=":projectId" element={<TaskList />} />
                                </Route>
                            </Route>
                            <Route element={<GuestRoute />}>
                                <Route element={<AuthLayout />}>
                                    <Route path="/login" element={<LoginForm />} />
                                    <Route path="/register" element={<RegisterForm />} />
                                </Route>
                            </Route>
                        </Routes>
                    </main>
                    <Toaster />
                </AuthContext.Provider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
