import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, List } from 'lucide-react';
import Modal from '@/app/dashboard/_components/Modal';

const productTypes = ['READY_MADE', 'CUSTOM_TAILORED', 'BOTH'] as const;
// Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters" }),
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
  type: z.enum(productTypes),
});



type ProductFormData = z.infer<typeof productSchema> & { sectionName: string };

interface ProductFormProps {
  onClose: () => void;
  onCreateProduct: (data: ProductFormData) => void;
  sectionName: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  onClose, 
  onCreateProduct, 
  sectionName 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sectionName: sectionName
    }
  });

  const onSubmit = (data: ProductFormData) => {
    onCreateProduct({
      ...data,
      sectionName: sectionName
    });
    reset();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-gray-800 text-white p-8 rounded-xl w-[500px] max-w-full">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-400" />
          Create New Product in {sectionName}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label 
              htmlFor="name" 
              className=" mb-2 text-sm font-medium flex items-center gap-2"
            >
              <List className="w-4 h-4 text-gray-400" />
              Product Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="price" 
              className=" mb-2 text-sm font-medium flex items-center gap-2"
            >
                <span className="text-gray-400">AED</span>
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { 
                setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="type" 
              className=" mb-2 text-sm font-medium flex items-center gap-2"
            >
              Type
            </label>
            <select
              id="type"
              {...register('type')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            > 
              {productTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
            
            


          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProductForm;