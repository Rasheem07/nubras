'use client'
import { Banknote, Plus } from "lucide-react";
import { useState } from "react";
import Modal from "../_components/Modal";
import MeasurementForm from "./_components/MeaurementForm";
import MeasurementTable from "./_components/measurementsTable";

export default function MeasurementsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


    return (
        <div className="p-8 max-w-[85vw]">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Measurements</h1>
            <div className="flex gap-3">

                <button
                    onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-3 px-6 flex items-center gap-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  
                >
                    <Plus className="w-5 h-5" />
                    Record New Measurement
                </button>
            </div>
        </div>


         {isCreateModalOpen && (
            <Modal onClose={() => setIsCreateModalOpen(false)}>
                <MeasurementForm />
            </Modal>
         )}

         <MeasurementTable />
        </div>
    )
}

