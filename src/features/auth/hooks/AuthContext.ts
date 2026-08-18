import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
    currentUser: User | null;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuthContext must be provided');
    }
    return context;
}
