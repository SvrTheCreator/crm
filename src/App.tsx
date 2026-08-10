import { Header } from './widgets/Header.tsx';
import { Workspace } from './pages/workspace/Workspace.tsx';
import { Footer } from './widgets/Footer.tsx';
import { useEffect, useState } from 'react';
import { AuthContext } from './features/auth/hooks/AuthContext.ts';
import { supabase } from './shared/utils/supabase.ts';

export function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setCurrentUser(session?.user.email ?? null);
            setLoading(false);
            console.log(session);
            console.log(event);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            <Header />
            <main>
                <Workspace />
            </main>
            <Footer />
        </AuthContext.Provider>
    );
}
