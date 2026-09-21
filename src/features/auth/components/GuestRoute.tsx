import { useAuth } from '../hooks/AuthContext.ts';
import { Navigate, Outlet } from 'react-router';

export function GuestRoute() {
    const { currentUser, loading } = useAuth();
    return (
        <>
            {loading && <div>Loading…</div>}
            {currentUser && !loading && <Navigate to="/projects" replace />}
            {!loading && !currentUser && <Outlet />}
        </>
    );
}
