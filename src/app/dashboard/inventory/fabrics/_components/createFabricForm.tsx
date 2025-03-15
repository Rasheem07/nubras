'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Zod schema for form validation
const fabricInventorySchema = z.object({
  fabricName: z.string().min(1, "Fabric name is required"),
  type: z.string().min(1, "Fabric type is required"),
  color: z.string().min(1, "Color is required"),
  costingPrice: z.coerce.number().min(0.01, "Costing price must be greater than 0"),
  sellingPrice: z.coerce.number().min(0.01, "Selling price must be greater than 0"),
  quantityAvailable: z.coerce.number().min(0, "Quantity cannot be negative"),
  reorderPoint: z.coerce.number().min(0, "Reorder point cannot be negative"),
  supplierId: z.string().optional(),
});

type FabricInventoryFormData = z.infer<typeof fabricInventorySchema>;

interface InventoryFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const FabricInventoryForm: React.FC<InventoryFormProps> = ({ setIsModalOpen }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FabricInventoryFormData>({
    resolver: zodResolver(fabricInventorySchema),
  });
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: FabricInventoryFormData) => {
      const response = await fetch("http://alnubrasstudio.ddns.net:8888/inventory/fabrics/add", {
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
      toast.success("Fabric added successfully!");
      return json;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["fabrics"] });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (formData: FabricInventoryFormData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-800 min-w-[500px] rounded-md shadow-md border border-gray-700 p-6 overflow-y-auto max-h-[85vh]">
      {[
        { label: "Fabric Name", field: "fabricName", type: "text" },
        { label: "Type", field: "type", type: "text" },
        { label: "Color", field: "color", type: "text" },
        { label: "Costing Price", field: "costingPrice", type: "number" },
        { label: "Selling Price", field: "sellingPrice", type: "number" },
        { label: "Quantity Available", field: "quantityAvailable", type: "number" },
        { label: "Reorder Point", field: "reorderPoint", type: "number" },
      ].map(({ label, field, type }) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-2">{label}</label>
          <input
            {...register(field as keyof FabricInventoryFormData, { valueAsNumber: type === "number" })}
            type={type}
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors[field as keyof FabricInventoryFormData] && (
            <p className="text-red-500 text-sm">{errors[field as keyof FabricInventoryFormData]?.message}</p>
          )}
        </div>
      ))}

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
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Fabric"}
        </button>
      </div>
    </form>
  );
};

export default FabricInventoryForm;
