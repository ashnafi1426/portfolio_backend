const { supabase } = require('../config/db');

class Project {
  // Create a new project
  static async create(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Get all projects with optional filters
  static async findAll(filters = {}) {
    let query = supabase
      .from('projects')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture
        )
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
  
  // Get single project by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture,
          bio
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Get projects by user ID
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  // Update project
  static async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns the project
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Delete project
  static async delete(id, userId) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure user owns the project
    
    if (error) throw error;
    return true;
  }
  
  // Check if user owns project
  static async isOwner(projectId, userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
    
    if (error) return false;
    return data && data.user_id === userId;
  }
  
  // Get featured projects
  static async getFeatured(limit = 6) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture
        )
      `)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
  
  // Search projects
  static async search(searchTerm) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture
        )
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

module.exports = Project;