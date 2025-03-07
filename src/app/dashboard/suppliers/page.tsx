'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react"
import DataTable from "../_components/DataTable.";
import Modal from "../_components/Modal";
import { toast } from "sonner";


export default function SupplierPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: suppliers, isLoading } = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            const response = await fetch('https://alnubras.hopto.org:3000/inventory/suppliers', {
                credentials: 'include'
            })
            const json = await response.json()
            return json
        }
    })


    const queryClient = useQueryClient()
    const createSupplier = async (data: any) => {
        const response = await fetch("https://alnubras.hopto.org:3000/inventory/suppliers/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            toast.error(json.message)
        }

        queryClient.invalidateQueries({ queryKey: ['suppliers'] });

        return true;
    }

    const createSupplierMutation = useMutation({
        mutationFn: createSupplier
    });

    const handleCreateSupplier = async (formData: FormData) => {
        console.log("works")
        const name = formData.get('name') as string;
        const contact = formData.get('contact') as string;


        if (!name || !contact) {
            toast.error('Name and contact is required');
        }

        
        console.log("works here")

         createSupplierMutation.mutate({ name, contact });
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Suppliers</h1>
                    <p className="text-gray-400 mt-1">Manage your suppliers</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add new supplier</span>
                </button>
            </div>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div className="bg-gray-800 p-8 rounded-xl max-w-4xl min-w-[400px] w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-green-400">Create New sales person</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateSupplier(new FormData(e.currentTarget));
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact</label>
                                    <input
                                        name="contact"
                                        type="text"
                                        placeholder="Enter Sales person contact..."
                                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>


                                <div className="flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                                    >
                                        Cancel

                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createSupplierMutation.isPending}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >

                                        {createSupplierMutation.isPending ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />

                                                Creating...
                                            </div>
                                        ) : (
                                            'Add a supplier'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
            <DataTable data={suppliers} exportFilename="suppliers" />
        </div>
    )
}