'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Zod schema for form validation
const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contact: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ setIsModalOpen }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: SupplierFormData) => {
      const response = await fetch("http://34.18.99.10/inventory/suppliers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message);
        return;
      }
      toast.success("Supplier added successfully!");
      return json;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (formData: SupplierFormData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-800 min-w-[500px] rounded-md shadow-md border border-gray-700 p-6 overflow-y-auto max-h-[85vh]">
      <div>
        <label className="block text-sm font-medium mb-2">Supplier Name</label>
        <input
          {...register("name")}
          type="text"
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Contact</label>
        <input
          {...register("contact")}
          type="text"
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="button"
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Supplier"}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
