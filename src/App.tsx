import { Header } from './widgets/Header.tsx';
import { Workspace } from './pages/workspace/Workspace.tsx';
import { Footer } from './widgets/Footer.tsx';
import { useEffect, useState } from 'react';
import { AuthContext } from './features/auth/hooks/AuthContext.ts';
import { supabase } from './shared/utils/supabase.ts';
import type { User } from '@supabase/supabase-js';

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
        <AuthContext.Provider value={{ currentUser, loading }}>
            <Header />
            <main>
                <Workspace />
            </main>
            <Footer />
        </AuthContext.Provider>
    );
}
