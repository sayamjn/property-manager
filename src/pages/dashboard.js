import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import AddProjectModal from '../components/AddProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import DeleteProjectModal from '../components/DeleteProjectModal';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else {
      fetchProjects();
    }
  }, [loading, user, router]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setShowEditModal(true);
  };

  const handleDelete = (project) => {
    setCurrentProject(project);
    setShowDeleteModal(true);
  };

  const addProject = async (project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (response.ok) {
        fetchProjects();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (project) => {
    try {
      const response = await fetch(`/api/projects?id=${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (response.ok) {
        fetchProjects();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchProjects();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter(project => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (project.name && project.name.toLowerCase().includes(searchTermLower)) ||
      (project.assetType && project.assetType.toLowerCase().includes(searchTermLower)) ||
      (project.model && project.model.toLowerCase().includes(searchTermLower))
    );
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Dashboard | Property Manager</title>
      </Head>
      
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Property Manager</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.username}</span>
            <button 
              onClick={logout}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Property List</h2>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Property
              </button>
            </div>
          </div>

          {isLoading ? (
            <p>Loading projects...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th 
                      className="py-3 px-4 text-left cursor-pointer border-b"
                      onClick={() => requestSort('name')}
                    >
                      Property Name {getSortIndicator('name')}
                    </th>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer border-b"
                      onClick={() => requestSort('assetType')}
                    >
                      Asset Type {getSortIndicator('assetType')}
                    </th>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer border-b"
                      onClick={() => requestSort('model')}
                    >
                      Model Used {getSortIndicator('model')}
                    </th>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer border-b"
                      onClick={() => requestSort('createdAt')}
                    >
                      Created On {getSortIndicator('createdAt')}
                    </th>
                    <th 
                      className="py-3 px-4 text-left cursor-pointer border-b"
                      onClick={() => requestSort('updatedAt')}
                    >
                      Updated On {getSortIndicator('updatedAt')}
                    </th>
                    <th className="py-3 px-4 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{project.name}</td>
                        <td className="py-3 px-4">{project.assetType}</td>
                        <td className="py-3 px-4">{project.model}</td>
                        <td className="py-3 px-4">{formatDate(project.createdAt)}</td>
                        <td className="py-3 px-4">{formatDate(project.updatedAt)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(project)} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(project)} 
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                        No properties found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSave={addProject}
        />
      )}
      
      {showEditModal && currentProject && (
        <EditProjectModal
          project={currentProject}
          onClose={() => setShowEditModal(false)}
          onSave={updateProject}
        />
      )}
      
      {showDeleteModal && currentProject && (
        <DeleteProjectModal
          project={currentProject}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => deleteProject(currentProject.id)}
        />
      )}
    </div>
  );
}