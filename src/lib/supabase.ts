import { createClient } from '@supabase/supabase-js';
import { User, Project } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getOrCreateUser(username: string): Promise<User> {
  // First try to find the user
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (existingUser) return existingUser as User;
  
  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error fetching user:', selectError);
    throw selectError;
  }

  // If not found, create new user
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([{ username }])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating user:', insertError);
    throw insertError;
  }
  
  return newUser as User;
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  return (data as Project[]) || [];
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .upsert(project, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving project:', error);
    throw error;
  }
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
