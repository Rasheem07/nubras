'use client'
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import ProductSectionForm from './_components/createSectionForm';
import SectionCard from './_components/productSectionCard';
import { toast } from 'sonner';

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const getSections = async () => {
        const response = await fetch('https://34.18.99.10/service/sections', { headers: { "Content-Type": "application/json" }, credentials: 'include' });
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    const createSection = async (data: { name: string }) => {
        const response = await fetch('https://34.18.99.10/service/add-section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',

            body: JSON.stringify(data)
        });
        const json = await response.json();
        if (response.ok) {
            toast.success(json.message)
        } else {
            toast.error(json.message)
        }

        return data;
    }

    const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useQuery<any[]>({
        queryKey: ['sections'],
        queryFn: getSections
    });

    const createSectionMutation = useMutation({
        mutationFn: createSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
        }
    });

    if (sectionsLoading) {

    }

    if (sectionsError) {
        return <div className="text-red-500 p-6">Error: {sectionsError.message}</div>
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Service Sections</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Section
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections && sections.map((section: any) => (
                    <SectionCard
                        key={section.id}
                        section={section}
                    />
                ))}
            </div>

            {isModalOpen && (
                <ProductSectionForm
                    onClose={() => setIsModalOpen(false)}
                    onCreateSection={(data) => createSectionMutation.mutate(data)}
                />
            )}

        </div>
    )
}