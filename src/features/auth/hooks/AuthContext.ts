import { createContext, useContext } from 'react';

type AuthContextType = {
    currentUser: string | null;
    setCurrentUser: (value: string | null) => void;
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
