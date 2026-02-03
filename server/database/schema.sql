-- SkillSync Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Persons Table
CREATE TABLE IF NOT EXISTS persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_picture VARCHAR(255) DEFAULT 'default-avatar.png',
    skills TEXT[], -- Array of skills
    github VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    website VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL, -- Array of technologies
    github_link VARCHAR(255),
    live_link VARCHAR(255),
    image VARCHAR(255) DEFAULT 'default-project.png',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(300),
    cover_image VARCHAR(255) DEFAULT 'default-blog.png',
    tags TEXT[], -- Array of tags
    published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_persons_email ON persons(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON persons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Persons
CREATE POLICY "Persons can view public profiles" ON persons
    FOR SELECT USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Persons can update own profile" ON persons
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Projects
CREATE POLICY "Anyone can view projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Blogs
CREATE POLICY "Anyone can view published blogs" ON blogs
    FOR SELECT USING (published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own blogs" ON blogs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blogs" ON blogs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blogs" ON blogs
    FOR DELETE USING (auth.uid() = user_id);

-- Create a view for public user profiles with their projects and blogs
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
    u.id,
    u.name,
    u.bio,
    u.profile_picture,
    u.skills,
    u.github,
    u.linkedin,
    u.twitter,
    u.website,
    u.created_at,
    (SELECT json_agg(json_build_object(
        'id', p.id,
        'title', p.title,
        'description', p.description,
        'tech_stack', p.tech_stack,
        'github_link', p.github_link,
        'live_link', p.live_link,
        'image', p.image,
        'featured', p.featured
    )) FROM projects p WHERE p.user_id = u.id) as projects,
    (SELECT json_agg(json_build_object(
        'id', b.id,
        'title', b.title,
        'excerpt', b.excerpt,
        'cover_image', b.cover_image,
        'tags', b.tags,
        'views', b.views,
        'created_at', b.created_at
    )) FROM blogs b WHERE b.user_id = u.id AND b.published = true) as blogs
FROM persons u
WHERE u.is_public = true;

-- Insert sample data (optional - for testing)
-- INSERT INTO persons (name, email, password, bio, skills) VALUES
-- ('John Doe', 'john@example.com', '$2a$10$hashedpassword', 'Full-stack developer', ARRAY['React', 'Node.js', 'PostgreSQL']);

COMMENT ON TABLE persons IS 'Stores user account information and profiles';
COMMENT ON TABLE projects IS 'Stores user projects and portfolio items';
COMMENT ON TABLE blogs IS 'Stores user blog posts and articles';
COMMENT ON VIEW public_profiles IS 'Public view of user profiles with their projects and blogs';