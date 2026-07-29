import { supabase } from '../../utils/supabase.ts';
import type { CreateProjectType } from './types.ts';
import type { UpdateField, UpdateValue } from '../tasks/types.ts';

export async function readProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select()
        .order('created_at', { ascending: false });

    return { data, error };
}
export async function createProject(newProject: CreateProjectType) {
    const { data, error } = await supabase.from('projects').insert(newProject).select().single();

    return { data, error };
}
export async function deleteProject(projectId: string) {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);

    return { error };
}

export async function updateProject(id: string, field: UpdateField, value: UpdateValue) {
    const { error } = await supabase
        .from('projects')
        .update({ [field]: value })
        .eq('id', id);

    return { error };
}
