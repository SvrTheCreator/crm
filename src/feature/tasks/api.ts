import { supabase } from '../../utils/supabase.ts';
import type { CreateTaskType, UpdateField, UpdateValue } from './types.ts';

export async function readTasks(projectId: string | null) {
    const response = await supabase
        .from('tasks')
        .select()
        .order('created_at', { ascending: false })
        .eq('project_id', projectId);

    return { data: response.data, error: response.error };
}

export async function createTask(task: CreateTaskType) {
    const response = await supabase.from('tasks').insert(task).select().single();

    return { data: response.data, error: response.error };
}

export async function deleteTask(id: string) {
    const response = await supabase.from('tasks').delete().eq('id', id);

    if (response.error) {
        console.log(response.error);
    }
    console.log('response:', response);

    return { error: response.error };
}

export async function updateTask(id: string, field: UpdateField, value: UpdateValue) {
    const response = await supabase
        .from('tasks')
        .update({ [field]: value })
        .eq('id', id);

    if (response.error) {
        console.log(response.error);
    }

    return { data: response.data, error: response.error };
}
