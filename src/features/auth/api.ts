import { supabase } from '../../shared/utils/supabase.ts';
import type { CreateUserType } from './types.ts';

export async function registerUser(newUser: CreateUserType) {
    const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
    });

    return { data, error };
}
