import { supabase } from '../../shared/utils/supabase.ts';
import type { CreateUserType, UserType } from './types.ts';

export async function registerUser(newUser: CreateUserType) {
    const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
    });

    return { data, error };
}
export async function loginUser(userData: UserType) {
    const { data, error } = await supabase.auth.signInWithPassword(userData);

    return { data, error };
}
