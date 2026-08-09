import { Header } from './widgets/Header.tsx';
import { Workspace } from './pages/workspace/Workspace.tsx';
import { Footer } from './widgets/Footer.tsx';
import { useEffect, useState } from 'react';
import { getUser } from './features/auth/api.ts';
import { AuthContext } from './features/auth/hooks/AuthContext.ts';

export function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // console.log(loading, currentUser);

    useEffect(() => {
        async function load() {
            const { data, error } = await getUser();
            if (data.user) {
                if (data.user.email) setCurrentUser(data.user.email);
                setLoading(false);

                return;
            }
            if (error !== null) {
                console.log(error.message);
                setCurrentUser(null);
                setLoading(false);
                return;
            }
        }
        load();
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
