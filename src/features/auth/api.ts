import { supabase } from '../../shared/utils/supabase.ts';
import type { CreateUserType, UserType } from './types.ts';

export async function registerUser(newUser: CreateUserType) {
    const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
            data: {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                user_avatar: newUser.user_avatar,
            },
        },
    });

    return { data, error };
}
export async function loginUser(userData: UserType) {
    const { data, error } = await supabase.auth.signInWithPassword(userData);

    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    return { error };
}
