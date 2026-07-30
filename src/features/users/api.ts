import { supabase } from '../../shared/utils/supabase.ts';

export async function getUsers() {
    const response = await supabase.from('profiles').select();

    return { data: response.data, error: response.error };
}
