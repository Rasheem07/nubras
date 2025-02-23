'use client'
import { Loader2, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import Modal from "../_components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SalespersonTable from "./_components/salesPersonTable";

export default function SalesPersonsPage() {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const queryClient = useQueryClient();
    
    const createSalesPerson = async (data: any) => {
        const response = await fetch("http://34.18.73.81:3000/salesperson/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to create sales person');
        }

        queryClient.invalidateQueries({ queryKey: ['salespersons'] });

        return response.json();

    }

    const createSalesPersonMutation = useMutation({
        mutationFn: createSalesPerson
    });

    const { data: salespersons, isLoading, error } = useQuery({
        queryKey: ['salespersons'],
        queryFn: () => fetch('http://34.18.73.81:3000/salesperson', {credentials: 'include'}).then(res => res.json())
    });


    const handleCreateSalesPerson = async (formData: FormData) => {
        const name = formData.get('name') as string;


        if (!name) {
            throw new Error('Name is required');
        }

        createSalesPersonMutation.mutate({ name });
    };
    return (


        <div className="p-8">


            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Sales persons</h1>
                <div className="flex gap-3">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >

                        <Mail className="w-5 h-5" />
                        Message All
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >

                        <UserPlus className="w-5 h-5" />
                        Add new sales person
                    </button>
                </div>
            </div>

            <SalespersonTable salespersons={salespersons} />
            
            {isCreateModalOpen && (
                 <Modal onClose={() => setIsCreateModalOpen(false)}>
                 <div className="bg-gray-800 p-8 rounded-xl max-w-4xl min-w-[400px] w-full shadow-2xl">
                     <h2 className="text-2xl font-bold mb-6 text-green-400">Create New Customer</h2>
                     <form onSubmit={(e) => {
                         e.preventDefault();
                         handleCreateSalesPerson(new FormData(e.currentTarget));
                     }}>
                         <div className="space-y-4">
                             <div>

                                 <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                 <input
                                     name="name"
                                     type="text"
                                     placeholder="Enter Sales person name..."
                                     className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                     required
                                 />
                             </div>
                             
                             
                             <div className="flex justify-end gap-3 pt-6">
                                 <button
                                     type="button"
                                     onClick={() => setIsCreateModalOpen(false)}
                                     className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                                 >
                                     Cancel

                                 </button>
                                 <button
                                     type="submit"
                                     disabled={createSalesPersonMutation.isPending}
                                     className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                 >

                                     {createSalesPersonMutation.isPending ? (
                                         <div className="flex items-center gap-2">
                                             <Loader2 className="w-4 h-4 animate-spin" />

                                             Creating...
                                         </div>
                                     ) : (
                                         'Add sales person'
                                     )}
                                 </button>
                             </div>
                         </div>
                     </form>
                 </div>
             </Modal>
            )}
        </div>


    );


}


