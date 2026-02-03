const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const { data, error } = await supabase
      .from('persons')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          password: hashedPassword
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Find user by email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
  
  // Find user by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('persons')
      .select('id, name, email, bio, profile_picture, skills, github, linkedin, twitter, website, role, is_public, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Find user by ID with password (for authentication)
  static async findByIdWithPassword(id) {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Update user profile
  static async update(id, updates) {
    const { data, error } = await supabase
      .from('persons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Delete user
  static async delete(id) {
    const { error } = await supabase
      .from('persons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
  
  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Get public profile with projects and blogs
  static async getPublicProfile(userId) {
    const { data, error } = await supabase
      .from('public_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Check if email exists
  static async emailExists(email) {
    const { data, error } = await supabase
      .from('persons')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
    
    return !!data;
  }
}

module.exports = User;