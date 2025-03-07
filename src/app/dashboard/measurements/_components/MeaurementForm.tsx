import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
// Define Zod validation schema
const measurementSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  productName: z.string().min(1, "Product Name is required"),
  chest: z.number().min(1, "Chest measurement must be greater than 0"),
  waist: z.number().min(1, "Waist measurement must be greater than 0"),
  hips: z.number().min(1, "Hips measurement must be greater than 0"),
  sleeve: z.number().min(1, "Sleeve measurement must be greater than 0"),
  inseam: z.number().min(1, "Inseam measurement must be greater than 0"),
  shoulder: z.number().min(1, "Shoulder measurement must be greater than 0"),
  notes: z.string().optional(),
});

// Component for the form
const MeasurementForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(measurementSchema),
  });

  const {mutate: createMeasurement} = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('http://alnubras.hopto.org:8888/measurement/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        toast.error('Failed to create measurement')
      }

      toast.success('Measurement created successfully')
      return response.json()

    }
  })


  const onSubmit = (data: any) => {
    createMeasurement(data)
  };


  return (
    <div className="max-w-3xl mx-auto p-6 min-w-[500px] overflow-y-auto max-h-[90vh] bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-500">Measurement Form</h2>

      {isSubmitted && (
        <div className="text-center text-green-500 mb-4">Form submitted successfully!</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-200">Customer ID</label>
            <input
              {...register("customerId")}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.customerId && (
              <p className="text-red-500 text-xs">{(errors.customerId as any)?.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-200">Product Name</label>
            <input
              {...register("productName")}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.productName && (
              <p className="text-red-500 text-xs">{(errors.productName as any)?.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">Chest</label>
            <input
              type="number"
              step="0.1"
              {...register("chest", { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.chest && (
              <p className="text-red-500 text-xs">{(errors.chest as any)?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Waist</label>
            <input
              type="number"
              step="0.1"
              {...register("waist", { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.waist && (
              <p className="text-red-500 text-xs">{(errors.waist as any)?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Hips</label>
            <input
              type="number"
              step="0.1"
              {...register("hips", { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.hips && (
              <p className="text-red-500 text-xs">{(errors.hips as any)?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Sleeve</label>
            <input
              type="number"
              step="0.1"
              {...register("sleeve", { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.sleeve && (
              <p className="text-red-500 text-xs">{(errors.sleeve as any)?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Inseam</label>
            <input
              type="number"
              step="0.1"
              {...register("inseam", { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.inseam && (
              <p className="text-red-500 text-xs">{(errors.inseam as any)?.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Shoulder</label>
            <input
              type="number"
              step="0.1"
              {...register("shoulder", { valueAsNumber: true })}
              className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
            />
            {errors.shoulder && (
              <p className="text-red-500 text-xs">{(errors.shoulder as any)?.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Notes</label>
          <textarea
            {...register("notes")}
            className="mt-1 block w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          {errors.notes && (
            <p className="text-red-500 text-xs">{(errors.notes as any)?.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Measurement
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeasurementForm;
