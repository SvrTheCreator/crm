import { useAuth } from '../features/auth/hooks/AuthContext.ts';
import { UserMenu } from '../features/auth/components/UserMenu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router';

export function Header() {
    const { currentUser, loading } = useAuth();

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>header</div>

            <div>
                {loading && 'Loading...'}
                {currentUser && <UserMenu currentUser={currentUser} />}
                {!currentUser && !loading && (
                    <div>
                        <Button nativeButton={false} render={<Link to="/login" />}>
                            Login
                        </Button>
                        <Button
                            variant="secondary"
                            nativeButton={false}
                            render={<Link to="/register" />}
                        >
                            Registration
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
