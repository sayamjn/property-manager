import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');

function getProjects() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    return [];
  }

  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// Helper function to save projects data
function saveProjects(projects) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET - Retrieve all projects
  if (req.method === 'GET') {
    const projects = getProjects();
    res.status(200).json({ projects });
  }
  
  // POST - Create a new project
  else if (req.method === 'POST') {
    const projects = getProjects();
    const newProject = req.body;
    
    if (!newProject.name || !newProject.address || !newProject.city) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!newProject.createdAt) {
      newProject.createdAt = new Date().toISOString();
    }
    if (!newProject.updatedAt) {
      newProject.updatedAt = new Date().toISOString();
    }
    
    if (!newProject.id) {
      newProject.id = Date.now().toString();
    }
    
    projects.push(newProject);
    saveProjects(projects);
    
    res.status(201).json({ project: newProject });
  }
  
  // PUT - Update a project
  else if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updatedProject = {
      ...projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    projects[projectIndex] = updatedProject;
    saveProjects(projects);
    
    res.status(200).json({ project: updatedProject });
  }
  
  // DELETE - Remove a project
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    let projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    projects = projects.filter(p => p.id !== id);
    saveProjects(projects);
    
    res.status(200).json({ success: true });
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}