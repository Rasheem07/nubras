'use client'
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, UseFormSetValue, UseFormWatch, SetValueConfig } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Enums
const OrderTypeEnum = z.enum(['READY_MADE', 'CUSTOM_TAILORED']);
const OrderStatusEnum = z.enum(['confirmed', 'processing', 'tailoring', 'ready', 'delivered']);
const PaymentStatusEnum = z.enum(['NO_PAYMENT', 'PARTIAL', 'PAID']);
const PaymentTypeEnum = z.enum(['VISA', 'CASH', 'BANK_TRANSFER']);

// Schemas
const measurementSchema = z.object({
  LengthInFront: z.number(),
  lengthBehind: z.number(),
  shoulder: z.number(),
  hands: z.number(),
  neck: z.number(),
  middle: z.number(),
  chest: z.number(),
  endOfShow: z.number(),
  fabricId: z.string(),
  notes: z.string().optional(),
});

const fabricSchema = z.object({
  name: z.string(),
  type: z.string(),
  color: z.string(),
  quantity: z.number(),
});

const transactionSchema = z.object({
  paymentType: PaymentTypeEnum,
  amount: z.number(),
  status: z.string().default("PENDING"),
  paymentDate: z.date().default(() => new Date()),
  paymentMethod: z.string(),
});

const orderSchema = z.object({
  InvoiceId: z.string(),
  type: OrderTypeEnum,
  branch: z.string(),
  status: OrderStatusEnum.default("confirmed"),
  orderedFrom: z.string().default("SHOP"),
  customerName: z.string(),
  sectionName: z.string(),
  salesPersonName: z.string(),
  customerLocation: z.string(),
  paymentStatus: PaymentStatusEnum.default("NO_PAYMENT"),
  productName: z.string(),
  productPrice: z.number(),
  quantity: z.number(),
  totalAmount: z.number(),
  orderRegisteredBy: z.string().optional(),
  PendingAmount: z.number(),
  PaidAmount: z.number().default(0),
  assignedTo: z.string().optional(),
  dueDate: z.date(),
});

const createOrderSchema = z.object({
  order: orderSchema,
  transactions: z.array(transactionSchema).optional(),
  fabrics: z.array(fabricSchema).optional(),
  measurements: z.array(measurementSchema).optional(),
}).superRefine((data, ctx) => {
  const { order, transactions, fabrics, measurements } = data;
  if (transactions && transactions.length > 0) {
    const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);
    
   
  }
  if (order.type === "CUSTOM_TAILORED") {
    if (fabrics && fabrics.length > 0) {
      const totalFabricQty = fabrics.reduce((sum, f) => sum + f.quantity, 0);
      if (totalFabricQty !== order.quantity) {
        ctx.addIssue({
          code: "custom",
          path: ["fabrics"],
          message: `Total fabric quantity (${totalFabricQty}) must match order quantity (${order.quantity}).`,
        });
      }
    }
    if (order.quantity > 0 && (!measurements || measurements.length !== order.quantity)) {
      ctx.addIssue({
        code: "custom",
        path: ["measurements"],
        message: `Number of measurements (${measurements?.length || 0}) must match order quantity (${order.quantity}).`,
      });
    }
  }
});

// Types
type OrderType = z.infer<typeof OrderTypeEnum>;
type OrderStatus = z.infer<typeof OrderStatusEnum>;
type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
type PaymentType = z.infer<typeof PaymentTypeEnum>;
type Measurement = z.infer<typeof measurementSchema>;
type Fabric = z.infer<typeof fabricSchema>;
type Transaction = z.infer<typeof transactionSchema>;
type Order = z.infer<typeof orderSchema>;
type CreateOrderFormData = z.infer<typeof createOrderSchema>;

// Sample data interfaces
interface Customer {
  phone: string;
  name: string;
  location: string;
}

interface Section {
  name: string;
}

interface SalesPerson {
  id: string;
  name: string;
}

interface Product {
  name: string;
  price: number;
  sectionName: string;
}


interface SearchSelectProps<T> {
  items: T[];
  value: string;
  onChange: (item: T) => void;
  placeholder: string;
  label: string;
  columns: { key: keyof T; label: string }[]; // Defines table columns
  valueKey: keyof T; // Specifies which field to use as value
  isLoading: boolean;
  setValue?: any
}

const SearchSelect = <T extends Record<string, any>>({
  items = [],
  value,
  onChange,
  placeholder,
  label,
  columns,
  valueKey,
  isLoading,
  setValue
}: SearchSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter items based on search query
  const filteredItems = isLoading
    ? []
    : items.filter((item) =>
      String(item[valueKey] || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 border outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-2 text-sm text-gray-400">
              Loading options...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">No results found</div>
          ) : (
            <table className="w-full text-sm text-white">
              <thead className="bg-gray-800">
                <tr>
                  {columns.map((col) => (
                    <th key={String(col.key)} className="px-3 py-2 text-left">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={String(item[valueKey])}
                    className="cursor-pointer hover:bg-gray-600"
                    onClick={() => {
                      onChange(item);
                      setSearch(String(item[valueKey])); // Show selected value
                      setIsOpen(false);
                      // If selecting a product, also set the section name
                      if (label === "Product") {
                        setValue("order.sectionName", item.sectionName);
                        setValue("order.productPrice", item.price);
                      }

                      if(label === "Customer") {
                        setValue("order.customerLocation", item.location)
                      }
                    }}
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-3 py-2 border-b border-gray-700">
                        {String(item[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};


const OrderCreationForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'measurements' | 'fabrics' | 'payment'>('details');

  const { register, control, handleSubmit, watch, formState: { errors }, setValue } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      order: {
        status: "confirmed",
        orderedFrom: "SHOP",
        paymentStatus: "NO_PAYMENT",
        PaidAmount: 0,
        dueDate: new Date(),
        type: "READY_MADE",
        totalAmount: 0,
      },
      transactions: [],
      fabrics: [],
      measurements: [],
    }
  });

  const { fields: fabricFields, append: appendFabric, remove: removeFabric } = useFieldArray({
    control,
    name: "fabrics",
  });

  const { fields: measurementFields, append: appendMeasurement, remove: removeMeasurement } = useFieldArray({
    control,
    name: "measurements",
  });

  const { fields: transactionFields, append: appendTransaction, remove: removeTransaction } = useFieldArray({
    control,
    name: "transactions",
  });

  const orderMutation = useMutation({
    mutationFn: async (data: CreateOrderFormData) => {
      const response = await fetch('http://34.18.99.10/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message);
      return;
    },
    onSuccess: () => {
      toast.success('Order created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { data: options, isLoading } = useQuery({
    queryKey: ['options'],
    queryFn: async () => {
      const response = await fetch('http://34.18.99.10/orders/values/distinct', {
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        }
      })
      return await response.json()
    }
  })

  const isCustomTailored = watch("order.type") === "CUSTOM_TAILORED";
  const totalAmount = watch('order.totalAmount') || 0;
  const paidAmount = watch('order.PaidAmount') || 0;
  const pendingAmount = totalAmount - paidAmount;

  useEffect(() => {
    setValue('order.PendingAmount', pendingAmount);
  }, [paidAmount, totalAmount, setValue]);

  const onSubmit = (data: CreateOrderFormData) => {
    orderMutation.mutate(data);
  };

  const productPrice = watch("order.productPrice");
  const productQty = watch("order.quantity")
  useEffect(() => {
    setValue("order.totalAmount", productPrice * productQty)
  }, [productPrice, productQty])

  useEffect(() => {
    console.log(errors)
  }, [errors]);



  return (
    <div className=" bg-gray-900 p-6 max-h-[calc(100vh-71px)] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex space-x-4">
            {watch('order.type') !== "READY_MADE" ?
              (['details', 'measurements', 'fabrics', 'payment'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))
              : (['details', 'payment'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
          </nav>
        </div>

        {/* Order Details Section */}
        <div className={activeTab === 'details' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Invoice ID</label>
                <input
                  {...register('order.InvoiceId')}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Order Type</label>
                <select
                  {...register('order.type')}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                >
                  <option value="READY_MADE">Ready Made</option>
                  <option value="CUSTOM_TAILORED">Custom Tailored</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Status</label>
                <select
                  {...register('order.status')}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="tailoring">Tailoring</option>
                  <option value="ready">Ready for pickup</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <SearchSelect<Customer>
                isLoading={isLoading}
                items={isLoading ? [] : options.customers}
                value={watch('order.customerName')}
                onChange={(item) => {
                  setValue('order.customerName', item.name);
                }}
                columns={[
                  { key: "name", label: "Customer Name" },
                  { key: "phone", label: "Phone Number" },
                  {key: "location", label: "Customer location"}
                ]}
                setValue={setValue}
                valueKey='name'
                placeholder="Search customer..."
                label="Customer"
              />



              <SearchSelect<SalesPerson>
                isLoading={isLoading}
                items={isLoading ? [] : options.salesPersons}
                value={watch('order.salesPersonName')}
                onChange={(item) => {
                  setValue('order.salesPersonName', item.name);
                }}
                columns={[
                  { key: "id", label: "id" },
                  { key: "name", label: "Salesperson Name" }
                ]}
                valueKey="name"
                placeholder="Search sales person..."
                label="Sales Person"
              />
            </div>

            <div className="space-y-4">
              <SearchSelect<Product>
                isLoading={isLoading}
                columns={[
                  { key: "name", label: "Product Name" },
                  { key: "sectionName", label: "Section" },
                  { key: "price", label: "Price" }
                ]}
                setValue={setValue}
                valueKey="name"
                items={isLoading ? [] : options.products}
                value={watch('order.productName')}
                onChange={(item) => {
                  setValue('order.productName', item.name);
                  setValue('order.productPrice', item.price);
                }}
                placeholder="Search product..."
                label="Product"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300">Branch</label>
                <input
                  {...register('order.branch')}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Customer Location</label>
                <input
                  {...register('order.customerLocation')}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Quantity</label>
                <input
                  type="number"
                  {...register('order.quantity', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Due Date</label>
                <input
                  type="date"
                  {...register('order.dueDate', {valueAsDate: true})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                />
              </div>

              {isCustomTailored && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">Assigned To</label>
                  <input
                    {...register('order.assignedTo')}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${activeTab === 'fabrics' && isCustomTailored ? 'block' : 'hidden'}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Fabrics</h2>
              <button
                type="button"
                onClick={() => appendFabric({
                  name: "",
                  type: "",
                  color: "",
                  quantity: 0
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add new fabric
              </button>
            </div>
            {fabricFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'name', label: 'Fabric name' },
                    { name: 'type', label: 'Fabric type' },
                    { name: 'color', label: 'Fabric color' },
                  ].map((fabric) => (
                    <div key={fabric.name}>
                      <label className="block text-sm font-medium text-gray-300">{fabric.label}</label>
                      <input
                        type="text"
                        step="0.1"
                        {...register(`fabrics.${index}.${fabric.name as keyof Fabric}` as const)}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                      />
                    </div>
                  ))}
                  <div >
                    <label className="block text-sm font-medium text-gray-300">Fabric quantity</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register(`fabrics.${index}.quantity`, { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    />
                  </div>
                </div>


                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeFabric(index)}
                    className="px-4 py-2 bg-red-600/20 text-red-200 border border-red-600 rounded-md hover:bg-red-600/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Measurements Section */}
        <div className={`${activeTab === 'measurements' && isCustomTailored ? 'block' : 'hidden'}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Measurements</h2>
              <button
                type="button"
                onClick={() => appendMeasurement({
                  LengthInFront: 0,
                  lengthBehind: 0,
                  shoulder: 0,
                  hands: 0,
                  neck: 0,
                  middle: 0,
                  chest: 0,
                  endOfShow: 0,
                  fabricId: '',
                  notes: ''
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Measurement
              </button>

            </div>

            {measurementFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'LengthInFront', label: 'Length in Front' },
                    { name: 'lengthBehind', label: 'Length Behind' },
                    { name: 'shoulder', label: 'Shoulder' },
                    { name: 'hands', label: 'Hands' },
                    { name: 'neck', label: 'Neck' },
                    { name: 'middle', label: 'Middle' },
                    { name: 'chest', label: 'Chest' },
                    { name: 'endOfShow', label: 'End of Show' }
                  ].map((measurement) => (
                    <div key={measurement.name}>
                      <label className="block text-sm font-medium text-gray-300">{measurement.label}</label>
                      <input
                        type="number"
                        step="0.1"
                        {...register(`measurements.${index}.${measurement.name as keyof Measurement}` as const, { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Fabric ID</label>
                    <input
                      {...register(`measurements.${index}.fabricId`)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Notes</label>
                    <textarea
                      {...register(`measurements.${index}.notes`)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMeasurement(index)}
                    className="px-4 py-2 bg-red-600/20 text-red-200 border border-red-600 rounded-md hover:bg-red-600/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Payment Section */}
        <div className={activeTab === 'payment' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Total Amount</h3>
              <p className="text-3xl font-bold text-white">${totalAmount}</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Paid Amount</h3>
              <p className="text-3xl font-bold text-green-500">${paidAmount}</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Pending Amount</h3>
              <p className="text-3xl font-bold text-yellow-500">${pendingAmount}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">Transactions</h2>
              <button
                type="button"
                onClick={() => appendTransaction({
                  paymentType: "CASH",
                  amount: 0,
                  status: "PENDING",
                  paymentDate: new Date(),
                  paymentMethod: ""
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </div>

            {transactionFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Payment Type</label>
                    <select
                      {...register(`transactions.${index}.paymentType`)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    >
                      <option value="CASH">Cash</option>
                      <option value="VISA">Visa</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`transactions.${index}.amount`, { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Payment Method</label>
                    <input
                      {...register(`transactions.${index}.paymentMethod`)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">Payment Date</label>
                    <input
                      type="date"
                      {...register(`transactions.${index}.paymentDate`, {valueAsDate: true})}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 outline-none focus:border-blue-600 focus"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTransaction(index)}
                    className="px-4 py-2 bg-red-600/20 text-red-200 border border-red-600 rounded-md hover:bg-red-600/30"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={orderMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {orderMutation.isPending ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderCreationForm;