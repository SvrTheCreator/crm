import type { CreateTaskType } from './types.ts';
import { supabase } from '@/shared/utils/supabase.ts';
import type { UpdateField, UpdateValue } from '@/shared/types.ts';

export async function readTasks(projectId: string | null) {
    const response = await supabase
        .from('tasks')
        .select('*, subtasks(count)')
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

    return { error: response.error };
}

export async function updateTask(id: string, field: UpdateField, value: UpdateValue) {
    const response = await supabase
        .from('tasks')
        .update({ [field]: value })
        .eq('id', id);

    return { data: response.data, error: response.error };
}
