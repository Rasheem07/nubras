// types.ts
import { LucideIcon } from 'lucide-react';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  totalOrders: number;
  lastOrder: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  type: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  totalQuantitySold: number;
  totalSalesAmount: number;
  sectionName: string;
}

export interface Section {
  id: string;
  name: string;
  totalQuantitySold: number;
  totalSalesAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  paymentType: string;
  amount: number;
  status: string;
  paymentDate: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Measurement {
  id: string;
  orderId: string;
  productName: string;
  chest: number;
  waist: number;
  hips: number;
  sleeve: number;
  inseam: number;
  shoulder: number;
  fabricId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  orderInvoiceId: string;
}

export interface OrderData {
  InvoiceId: string;
  date: string;
  type: string;
  branch: string;
  status: string;
  salesPersonName: string;
  orderedFrom: string;
  Customer: Customer;
  createdAt: string;
  updatedAt: string;
  section: Section;
  product: Product;
  paymentStatus: string;
  quantity: number;
  totalAmount: number;
  deliveryDate: string;
  paymentDate: string;
  Transactions: Transaction[];
  PendingAmount: number;
  PaidAmount: number;
  assignedTo: string;
  Measurement: Measurement[];
}

export interface OrderStep {
  title: string;
  description: string;
  icon: LucideIcon;
  date: string;
}