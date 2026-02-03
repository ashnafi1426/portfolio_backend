const { supabase } = require('../config/db');

class Blog {
  // Create a new blog post
  static async create(blogData) {
    // Auto-generate excerpt if not provided
    if (!blogData.excerpt && blogData.content) {
      blogData.excerpt = blogData.content.substring(0, 150) + '...';
    }
    
    const { data, error } = await supabase
      .from('blogs')
      .insert([blogData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Get all blogs with optional filters
  static async findAll(filters = {}) {
    let query = supabase
      .from('blogs')
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
    
    if (filters.published !== undefined) {
      query = query.eq('published', filters.published);
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
  
  // Get single blog by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('blogs')
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
  
  // Get blogs by user ID
  static async findByUserId(userId, includeUnpublished = false) {
    let query = supabase
      .from('blogs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
  
  // Update blog
  static async update(id, userId, updates) {
    // Update excerpt if content changed
    if (updates.content && !updates.excerpt) {
      updates.excerpt = updates.content.substring(0, 150) + '...';
    }
    
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns the blog
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Delete blog
  static async delete(id, userId) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure user owns the blog
    
    if (error) throw error;
    return true;
  }
  
  // Check if user owns blog
  static async isOwner(blogId, userId) {
    const { data, error } = await supabase
      .from('blogs')
      .select('user_id')
      .eq('id', blogId)
      .single();
    
    if (error) return false;
    return data && data.user_id === userId;
  }
  
  // Increment blog views
  static async incrementViews(id) {
    const { data, error } = await supabase
      .rpc('increment_blog_views', { blog_id: id });
    
    if (error) {
      // Fallback if RPC doesn't exist
      const blog = await this.findById(id);
      if (blog) {
        await supabase
          .from('blogs')
          .update({ views: blog.views + 1 })
          .eq('id', id);
      }
    }
    
    return true;
  }
  
  // Get recent blogs
  static async getRecent(limit = 10) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture
        )
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
  
  // Search blogs
  static async search(searchTerm) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture
        )
      `)
      .eq('published', true)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  // Get blogs by tag
  static async findByTag(tag) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        persons:user_id (
          id,
          name,
          profile_picture
        )
      `)
      .eq('published', true)
      .contains('tags', [tag])
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

module.exports = Blog;