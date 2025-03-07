// EmployeeForm.tsx
'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeSchema, type EmployeeFormData, EmployeeRole } from './types/formTypes';
import { Plus } from 'lucide-react';
import Modal from '../_components/Modal';
import DataTable from '../_components/DataTable.';
import { toast } from 'sonner';

const createEmployee = async (data: EmployeeFormData) => {
  const response = await fetch('https://alnubras.hopto.org:3000/admin/add-employee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (!response.ok) {
    toast.error(json.message)
    return;
  }
    toast.success(json.message)

  return json;

};

export default function EmployeeForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      areaCode: '+971',
    },
  });

  const { data: tailors, isLoading } = useQuery({
    queryKey: ['tailors'],
    queryFn: async () => {
      const response = await fetch('https://alnubras.hopto.org:3000/tailor', {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });
      const json = await response.json()
      return json;
    }
  })

  const mutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error creating employee:', error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tailors</h1>
          <p className="text-gray-400 mt-1">Manage your tailors</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add new tailor</span>
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} >

          <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Add New Tailor</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="mt-1 outline-none block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 py-2 px-4 focus:ring-blue-500"
                />

                {errors.name && (
                  <p className="mt-1  text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-200">
                  Role
                </label>
                <select
                  {...register('role')}
                  id="role"
                  className="mt-1  block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 py-2 px-4 focus:ring-indigo-500"
                >
                  <option value="">Select a role</option>
                  {Object.values(EmployeeRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1  text-sm text-red-400">{errors.role.message}</p>
                )}
              </div>

              {/* Contact Field with Area Code */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-200">
                  Contact Number
                </label>
                <div className="mt-1  flex rounded-md shadow-sm">
                  <select
                    {...register('areaCode')}
                    className="w-24 rounded-l-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 py-2 px-4 focus:ring-indigo-500"
                  >
                    <option value="+971">+971</option>
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                  </select>
                  <input
                    {...register('contact')}
                    type="text"
                    id="contact"
                    className="block outline-none w-full flex-1 rounded-r-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 py-2 px-4 focus:ring-indigo-500"
                  />
                </div>
                {errors.contact && (
                  <p className="mt-1  text-sm text-red-400">{errors.contact.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>

              {/* Form Error Message */}
              {mutation.isError && (
                <div className="rounded-md bg-red-900/50 p-4 border border-red-700">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-400">
                        Error creating employee
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Modal>
      )}
      <DataTable data={tailors} exportFilename='tailors' />
    </div>
  );
}