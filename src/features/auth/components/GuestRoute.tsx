import { useAuth } from '../hooks/AuthContext.ts';
import { Navigate, Outlet } from 'react-router';
import { FullPageSpinner } from '@/shared/components/FullPageSpinner.tsx';

export function GuestRoute() {
    const { currentUser, loading } = useAuth();

    if (loading) return <FullPageSpinner />;
    if (currentUser) return <Navigate to="/projects" replace />;

    return <Outlet />;
}
