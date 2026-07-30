import type { CreateSubtaskType } from './types.ts';
import type { UpdateField, UpdateValue } from '../tasks/types.ts';
import { supabase } from '../../shared/utils/supabase.ts';

export async function readSubtasks(taskId: string) {
    const response = await supabase
        .from('subtasks')
        .select()
        .order('created_at', { ascending: false })
        .eq('task_id', taskId);

    return { data: response.data, error: response.error };
}

export async function createSubtask(newSubtask: CreateSubtaskType) {
    const response = await supabase.from('subtassks').insert(newSubtask).select().single();

    return { data: response.data, error: response.error };
}

export async function deleteSubtask(id: string) {
    const response = await supabase.from('subtasks').delete().eq('id', id);

    return { data: response.data, error: response.error };
}

export async function updateSubtask(id: string, field: UpdateField, value: UpdateValue) {
    const response = await supabase
        .from('subtasks')
        .update({ [field]: value })
        .eq('id', id);

    return { data: response.data, error: response.error };
}
