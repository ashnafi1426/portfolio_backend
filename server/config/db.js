require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('persons')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist yet
      console.error('❌ Supabase Connection Error:', error.message);
    } else {
      console.log('✅ Supabase PostgreSQL Connected Successfully');
    }
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
  }
};

module.exports = { supabase, testConnection };