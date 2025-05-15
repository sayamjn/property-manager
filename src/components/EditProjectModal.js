import { useState, useEffect } from 'react';

export default function EditProjectModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    city: '',
    assetType: '',
    model: '',
    state: '',
    zip: '',
    createdAt: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        name: project.name || '',
        address: project.address || '',
        city: project.city || '',
        assetType: project.assetType || 'Multi Family',
        model: project.model || '',
        state: project.state || '',
        zip: project.zip || '',
        createdAt: project.createdAt || '',
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button onClick={onClose} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Property Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assetType">
              Asset Type
            </label>
            <select
              id="assetType"
              name="assetType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.assetType}
              onChange={handleChange}
              required
            >
              <option value="Multi Family">Multi Family</option>
              <option value="Retail">Retail</option>
              <option value="Self Storage">Self Storage</option>
              <option value="Office">Office</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
              Model
            </label>
            <select
              id="model"
              name="model"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.model}
              onChange={handleChange}
            >
              <option value="">Select Model...</option>
              <option value="CLIK IRR">CLIK IRR</option>
              <option value="CREFC">CREFC</option>
              <option value="Self Storage template loan sizer">Self Storage template loan sizer</option>
            </select>
          </div>
          
          <div className="border-t border-gray-200 my-4 py-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Property Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zip">
                  Zip
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.zip}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}