'use client'
import { useState } from 'react';
import { Banknote, Mail } from 'lucide-react';
import Modal from '../_components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TransactionTable from './_components/transactionsTable';
import { toast } from 'sonner';
import { Song_Myung } from 'next/font/google';

const paymentTypes = ['CASH', 'VISA', 'BANK_TRANSFER'] as const;

const transactionSchema = z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    customerName: z.string().min(1, 'Customer name is required'),
    paymentType: z.enum(paymentTypes),
    amount: z.number().min(0.01, 'Amount must be greater than zero'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function TransactionsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
    });

    const queryClient = useQueryClient()
    const onSubmit = async (data: TransactionFormData) => {
        const response = await fetch('http://34.18.73.81:3000/transactions/create', {
            method: 'POST',     
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })

        const json = await response.json();
        if (response.ok) {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            setIsCreateModalOpen(false);
            toast.success(json.message)
        } else {
            toast.error(json.message)
        }
    };


    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const response = await fetch('http://34.18.73.81:3000/transactions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            credentials: 'include',

            })
            return response.json()
        }
    })




    return (
        <div className="p-8 max-h-[calc(100vh-71px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Banknote className="w-5 h-5" />
                        Record New Transaction
                    </button>
                </div>
            </div>

            {isCreateModalOpen && (
                <Modal onClose={() => setIsCreateModalOpen(false)}>
                    <div className="bg-gray-800 p-8 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto min-w-[500px] w-full shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Record New Transaction
                        </h2>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            <div>
                                <label
                                    htmlFor="orderId"
                                    className="text-white text-sm font-medium"
                                >
                                    Order ID
                                </label>
                                <input
                                    type="text"
                                    id="orderId"
                                    {...register('orderId')}
                                    className="w-full p-3 bg-gray-700 text-white outline-none rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.orderId && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.orderId.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="customerName"
                                    className="text-white text-sm font-medium"
                                >
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    {...register('customerName')}
                                    className="w-full p-3 bg-gray-700 text-white outline-none rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.customerName && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.customerName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="paymentType"
                                    className="text-white text-sm font-medium"
                                >
                                    Payment Type
                                </label>
                                <select
                                    id="paymentType"
                                    {...register('paymentType')}
                                    className="w-full p-3 bg-gray-700 text-white outline-none rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    {paymentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.paymentType && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.paymentType.message}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label
                                    htmlFor="amount"
                                    className="text-white text-sm font-medium"
                                >
                                    Amount (AED)
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    {...register('amount', { valueAsNumber: true })}
                                    className="w-full p-3 bg-gray-700 text-white outline-none rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.amount && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="paymentMethod"
                                    className="text-white text-sm font-medium"
                                >
                                    Payment Method
                                </label>
                                <input
                                    type="text"
                                    id="paymentMethod"
                                    {...register('paymentMethod')}
                                    className="w-full p-3 bg-gray-700 text-white outline-none rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.paymentMethod && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.paymentMethod.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="transactionId"
                                    className="text-white text-sm font-medium"
                                >
                                    Transaction ID
                                </label>
                                <input
                                    type="text"
                                    id="transactionId"
                                    {...register('transactionId')}
                                    className="w-full p-3 bg-gray-700 text-white outline-none rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.transactionId && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.transactionId.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="bg-gray-600 w-full text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 w-full text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}


           <TransactionTable transactions={transactions} />

        </div>
    );
}

