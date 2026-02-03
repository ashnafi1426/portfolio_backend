const express = require('express');
const router = express.Router();

// Sample skills data
const skills = [
  {
    id: 1,
    name: "HTML5",
    category: "Frontend",
    level: 90,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    color: "#E34F26",
    description: "Building responsive and visually appealing web interfaces."
  },
  {
    id: 2,
    name: "CSS3",
    category: "Frontend",
    level: 90,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    color: "#1572B6",
    description: "Styling modern web applications with advanced CSS."
  },
  {
    id: 3,
    name: "JavaScript",
    category: "Frontend",
    level: 85,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E",
    description: "Writing dynamic, interactive, and efficient code."
  },
  {
    id: 4,
    name: "React",
    category: "Frontend",
    level: 80,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DBFB",
    description: "Creating reusable components and SPAs."
  },
  {
    id: 5,
    name: "Node.js",
    category: "Backend",
    level: 85,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#3C873A",
    description: "Developing fast and scalable backend applications."
  },
  {
    id: 6,
    name: "MySQL",
    category: "Database",
    level: 80,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "#00618A",
    description: "Managing structured data and efficient queries."
  },
  {
    id: 7,
    name: "MongoDB",
    category: "Database",
    level: 85,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248",
    description: "Working with NoSQL databases and document storage."
  },
  {
    id: 8,
    name: "PostgreSQL",
    category: "Database",
    level: 80,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791",
    description: "Advanced relational database management."
  },
  {
    id: 9,
    name: "Express.js",
    category: "Backend",
    level: 85,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    color: "#000000",
    description: "Building RESTful APIs and web servers."
  },
  {
    id: 10,
    name: "Tailwind CSS",
    category: "Frontend",
    level: 90,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    color: "#06B6D4",
    description: "Rapid UI development with utility-first CSS."
  },
  {
    id: 11,
    name: "Git",
    category: "Tools",
    level: 85,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    color: "#F05032",
    description: "Version control and collaborative development."
  },
  {
    id: 12,
    name: "TypeScript",
    category: "Language",
    level: 75,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    description: "Type-safe JavaScript development."
  }
];

// GET /api/skills - Get all skills
router.get('/', (req, res) => {
  try {
    const { category, limit } = req.query;
    
    let filteredSkills = [...skills];
    
    // Filter by category
    if (category) {
      filteredSkills = filteredSkills.filter(
        skill => skill.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Limit results
    if (limit) {
      filteredSkills = filteredSkills.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      count: filteredSkills.length,
      data: filteredSkills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
});

// GET /api/skills/categories - Get all skill categories
router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(skills.map(skill => skill.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill categories'
    });
  }
});

module.exports = router;