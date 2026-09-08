import type { CreateProjectType } from './types.ts';
import type { UpdateField, UpdateValue } from '../tasks/types.ts';
import { supabase } from '../../shared/utils/supabase.ts';

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
    const { data, error } = await supabase.from('projects').delete().eq('id', projectId).select();

    return { data, error };
}

export async function updateProject(id: string, field: UpdateField, value: UpdateValue) {
    const { data, error } = await supabase
        .from('projects')
        .update({ [field]: value })
        .eq('id', id)
        .select();

    return { data, error };
}

export async function getProjectUser(projectId: string) {
    const { data, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId);
    return { data, error };
}

export async function addMembership(user_id: string, project_id: string) {
    const { data, error } = await supabase
        .from('project_members')
        .insert([
            {
                project_id: project_id,
                user_id: user_id,
            },
        ])
        .select();

    return { data, error };
}
export async function removeMembership(user_id: string, project_id: string) {
    const { data, error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', project_id)
        .eq('user_id', user_id)
        .select();

    return { data, error };
}
