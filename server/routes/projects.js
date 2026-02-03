const express = require('express');
const router = express.Router();

// Sample projects data (in a real app, this would come from a database)
const projects = [
  {
    id: 1,
    title: "Amazon Clone Project",
    description: "A full e-commerce frontend project built with React and modern web technologies.",
    image: "/images/amazone-project.webp",
    category: "Fullstack Project",
    technologies: ["React", "CSS3", "JavaScript", "Responsive Design"],
    liveUrl: "https://amazone-frontend-wod3.vercel.app/",
    githubUrl: "https://github.com/ashnafi1426/amazon-clone",
    featured: true
  },
  {
    id: 2,
    title: "Netflix Clone Project",
    description: "A responsive Netflix clone frontend built with HTML, CSS, and JavaScript.",
    image: "/images/netflix-project.webp",
    category: "Fullstack Project",
    technologies: ["HTML5", "CSS3", "JavaScript", "API Integration"],
    liveUrl: "https://ashnafi1426.github.io/Netflixclonee/",
    githubUrl: "https://github.com/ashnafi1426/netflix-clone",
    featured: true
  },
  {
    id: 3,
    title: "Evangadi Forum Project",
    description: "A full-stack forum application with user authentication and real-time discussions.",
    image: "/images/evandadi.jpg",
    category: "Fullstack Project",
    technologies: ["React", "Node.js", "MongoDB", "JWT", "Express"],
    liveUrl: "https://evangadi-forum-nu-tawny.vercel.app/",
    githubUrl: "https://github.com/ashnafi1426/evangadi-forum",
    featured: true
  },
  {
    id: 4,
    title: "Garage Management App",
    description: "A full garage app used for managing employees, customers and orders.",
    image: "/images/graeteee.png",
    category: "Fullstack Project",
    technologies: ["React", "Node.js", "MySQL", "Express", "JWT"],
    liveUrl: "https://abbegaragaga.vercel.app/",
    githubUrl: "https://github.com/ashnafi1426/garage-app",
    featured: false
  },
  {
    id: 5,
    title: "Blog Website",
    description: "A modern blog platform with clean design and smooth user experience.",
    image: "/images/blog-website.webp",
    category: "Fullstack Project",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    liveUrl: "https://blogwebsite55.netlify.app/",
    githubUrl: "https://github.com/ashnafi1426/blog-website",
    featured: true
  }
];

// GET /api/projects - Get all projects
router.get('/', (req, res) => {
  try {
    const { featured, category, limit } = req.query;
    
    let filteredProjects = [...projects];
    
    // Filter by featured
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(project => project.featured);
    }
    
    // Filter by category
    if (category) {
      filteredProjects = filteredProjects.filter(
        project => project.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Limit results
    if (limit) {
      filteredProjects = filteredProjects.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      count: filteredProjects.length,
      data: filteredProjects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// GET /api/projects/categories - Get all categories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(projects.map(project => project.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;