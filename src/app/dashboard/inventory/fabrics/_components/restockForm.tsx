'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, List, User } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

// Zod schema for form validation
const fabricRestockSchema = z.object({
  fabricName: z.string().min(1, "Fabric name is required"),
  quantityAvailable: z.coerce.number().min(1, "Quantity must be at least 1").int("Quantity must be an integer"),
  supplierName: z.string().min(1, "Supplier name is required"),
  purchasePrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
  movementDate: z.string().min(1, "Movement date is required"),
  reorderPoint: z.coerce.number().min(1, "Reorder point must be at least 1"),
});

type FabricRestockFormData = z.infer<typeof fabricRestockSchema>;

interface RestockFormProps {
  setIsRestockModalOpen: (isOpen: boolean) => void;
}

const FabricRestockForm: React.FC<RestockFormProps> = ({ setIsRestockModalOpen }) => {
  const { fabric } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm<FabricRestockFormData>({
    resolver: zodResolver(fabricRestockSchema),
  });
  const queryClient = useQueryClient();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (data: FabricRestockFormData) => {
      const response = await fetch(`http://alnubras.hopto.org:8888/inventory/restock/fabric`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...data, fabricName: fabric }),
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message);
        return;
      }
      toast.success(json.message);
      return json;
    },
    onSuccess: () => {
      setIsRestockModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['fabricInventory'] });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (formData: FabricRestockFormData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Fabric Name */}
        <div>
          <label className="mb-2 text-sm font-medium flex items-center gap-2">
            Fabric Name
          </label>
          <input
            {...register("fabricName")}
            type="text"
            placeholder="Enter fabric name..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.fabricName && <p className="text-red-500 text-sm">{errors.fabricName.message}</p>}
        </div>

        {/* Quantity Available */}
        <div>
          <label className="mb-2 text-sm font-medium flex items-center gap-2">
            <List className="w-4 h-4 text-gray-400" />
            Quantity Available
          </label>
          <input
            {...register("quantityAvailable", { valueAsNumber: true })}
            type="number"
            placeholder="Enter quantity available..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.quantityAvailable && <p className="text-red-500 text-sm">{errors.quantityAvailable.message}</p>}
        </div>

        {/* Supplier Name */}
        <div>
          <label className="mb-2 text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Supplier Name
          </label>
          <input
            {...register("supplierName")}
            type="text"
            placeholder="Enter supplier name..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.supplierName && <p className="text-red-500 text-sm">{errors.supplierName.message}</p>}
        </div>

        {/* Purchase Price */}
        <div>
          <label className="mb-2 text-sm font-medium flex items-center gap-2">
            Purchase Price
          </label>
          <input
            {...register("purchasePrice", { valueAsNumber: true })}
            type="number"
            placeholder="Enter purchase price..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.purchasePrice && <p className="text-red-500 text-sm">{errors.purchasePrice.message}</p>}
        </div>

        {/* Movement Date */}
        <div>
          <label className="mb-2 text-sm font-medium flex items-center gap-2">
            Movement Date
          </label>
          <input
            {...register("movementDate")}
            type="date"
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.movementDate && <p className="text-red-500 text-sm">{errors.movementDate.message}</p>}
        </div>

        {/* Reorder Point */}
        <div>
          <label className="mb-2 text-sm font-medium flex items-center gap-2">
            Reorder Point
          </label>
          <input
            {...register("reorderPoint", { valueAsNumber: true })}
            type="number"
            placeholder="Enter reorder point..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.reorderPoint && <p className="text-red-500 text-sm">{errors.reorderPoint.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
            onClick={() => setIsRestockModalOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Restock Fabric"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FabricRestockForm;