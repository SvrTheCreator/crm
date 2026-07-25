import { supabase } from '../utils/supabase.ts';

export async function getTasks(projectId: string | null) {
    const response = await supabase
        .from('tasks')
        .select()
        .order('created_at', { ascending: false })
        .eq('project_id', projectId);

    if (response.error) {
        console.log(response.error);
        return;
    }
    return response.data;
}
