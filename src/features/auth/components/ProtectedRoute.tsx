import { useAuth } from '../hooks/AuthContext.ts';
import { Navigate, Outlet } from 'react-router';

export function ProtectedRoute() {
    const { currentUser, loading } = useAuth();
    return (
        <>
            {loading && <div>Loading…</div>}
            {!currentUser && !loading && <Navigate to="/login" replace />}
            {!loading && currentUser && <Outlet />}
        </>
    );
}
