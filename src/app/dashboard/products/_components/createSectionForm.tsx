import React, { useState } from 'react';
import Modal from '@/app/dashboard/_components/Modal'; // Assuming this is the correct import path


interface ProductSectionFormProps {
  onCreateSection: (data: { name: string }) => void;
  onClose: () => void;
}

const ProductSectionForm: React.FC<ProductSectionFormProps> = ({ onCreateSection, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (name.trim().length < 2) {
      setError('Section name must be at least 2 characters');
      return;
    }

    // Clear any previous errors
    setError('');

    // Call the create section handler
    onCreateSection({ name: name.trim() });
    
    // Close the modal
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Create New Product Section</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Section Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter section name"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Create Section
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProductSectionForm;