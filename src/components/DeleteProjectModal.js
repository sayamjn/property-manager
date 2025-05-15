export default function DeleteProjectModal({ project, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Delete Property</h2>
          <button onClick={onClose} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the property <strong>{project.name}</strong>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}