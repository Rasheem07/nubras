"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit2, Trash2, Package, Scissors, Settings, ChevronDown, Loader2, List, Layers, Tag, DollarSign } from "lucide-react";
import { ServiceFormData, ServiceType, serviceFormSchema } from "./types/index";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Modal from "../../_components/Modal";

interface Service {
  id: string;
  type: ServiceType;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  sectionName: string;
  totalQuantitySold: number;
  totalSalesAmount: number;
}

export default function ServicesPage() {
  const {section} = useParams<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);


  const {data: services, isLoading} = useQuery<Service[]>({
    queryKey: [section as string],
    queryFn: async () => {
       const response = await fetch(`http://34.18.73.81:3000/service/${section}`, {
         headers: {
            "Content-Type": "application/json"
         },
         credentials: 'include'
       })
       return await response.json()
    }
  })

  const {register, handleSubmit, formState: {errors}, reset} = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {    
      name: "",
      type: ServiceType.READY_MADE,
      price: 0,
      sectionName: section
    },
  });

  const getServiceTypeIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.READY_MADE:
        return <Package className="w-6 h-6 text-blue-400" />;
      case ServiceType.CUSTOM_MADE:
        return <Scissors className="w-6 h-6 text-purple-400" />;
      case ServiceType.BOTH:
        return <Settings className="w-6 h-6 text-green-400" />;
    }
  };

  const queryClient = useQueryClient();

  const {mutate: addNewService} = useMutation({
    mutationFn: async (data: ServiceFormData) => {
        const response = await fetch('http://34.18.73.81:3000/service/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
             },
             credentials: 'include',
             body: JSON.stringify(data)
        })

        const json = await response.json()

        if(response.ok) {
            toast.success(json.message)
        } else {
            toast.error(json.message)
        }

        queryClient.invalidateQueries(section)
        return json;
    }
  })

  const onSubmit = async (data: ServiceFormData) => {
    try {
      console.log(data);
      addNewService(data)
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 p-8 max-h-[calc(100vh-71px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Services</h1>
            <p className="text-gray-400 mt-1">Manage your service offerings</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        {isModalOpen && (
             <Modal onClose={() => setIsModalOpen(false)}>
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
               <h2 className="text-xl font-bold text-white mb-4">Add New Service</h2>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                 
                 <div className="space-y-1">
                   <label className="text-gray-300 text-sm flex items-center gap-2">
                     <Tag size={16} /> Service Name
                   </label>
                   <input
                     {...register("name")}
                     className="outline-none w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                     placeholder="Enter service name"
                   />
                   {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                 </div>
       
                 <div className="space-y-1">
                   <label className="text-gray-300 text-sm flex items-center gap-2">
                     <Layers size={16} /> Type
                   </label>
                   <select
                     {...register("type")}
                     className="w-full p-2 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:border-blue-600"
                   >
                     <option value={ServiceType.READY_MADE}>Ready Made</option>
                     <option value={ServiceType.CUSTOM_MADE}>Custom Made</option>
                     <option value={ServiceType.BOTH}>Both</option>
                   </select>
                 </div>
       
                 <div className="space-y-1">
                   <label className="text-gray-300 text-sm flex items-center gap-2">
                     <span className="text-gray-400 font-medium">AED</span> Costing Price 
                   </label>
                   <input
                     type="number"
                     {...register("costingPrice", { valueAsNumber: true })}
                     className="outline-none w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                     placeholder="Enter price"
                   />
                   {errors.costingPrice && <p className="text-red-500 text-sm">{errors.costingPrice.message}</p>}
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-300 text-sm flex items-center gap-2">
                     <span className="text-gray-400 font-medium">AED</span> Selling Price 
                   </label>
                   <input
                     type="number"
                     {...register("price", { valueAsNumber: true })}
                     className="outline-none w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                     placeholder="Enter price"
                   />
                   {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                 </div>
       
                 <div className="space-y-1">
                   <label className="text-gray-300 text-sm flex items-center gap-2">
                     <List size={16} /> Section
                   </label>
                   <input
                     {...register("sectionName")}
                     className="outline-none w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500"
                     placeholder="Enter section name"
                   />
                   {errors.sectionName && <p className="text-red-500 text-sm">{errors.sectionName.message}</p>}
                 </div>
       
                 <button
                   type="submit"
                   className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                 >
                   Add Service
                 </button>
               </form>
             </div>
           </Modal>
        )}
         
        {isLoading && (
            <div className="mt-12 flex flex-col items-center gap-2 w-full justify-center">
                <Loader2 className="h-5 w-5 animate-spin"/>
                <p className="font-sans text-zinc-50">loading services</p>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scroll-smooth max-h-[65vh]">
          {services && services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800 rounded-lg p-6 hover:ring-1 border border-gray-700 shadow-md hover:ring-blue-500 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    {getServiceTypeIcon(service.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{service.name}</h3>
                    <p className="text-sm text-gray-400">{service.sectionName}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="font-semibold text-white">${service.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <span className="text-white">{service.type.replace("_", " ")}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Units Sold</p>
                  <p className="font-semibold text-white">{service.totalQuantitySold}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Sales</p>
                  <p className="font-semibold text-white">${service.totalSalesAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}