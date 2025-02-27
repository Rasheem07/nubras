type Item = {
  id: string;
  type: string;
  productName: string;
  productPrice: number;
  quantity: number;
  sectionName: string;
  createdAt: string;
  updatedAt: string;
  orderInvoiceId: number;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  location: string;
  totalOrders: number;
  lastOrder: string | null;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
};

type SalesPerson = {
  id: string;
  name: string;
  totalOrders: number;
  totalSalesAmount: number;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  orderId: number;
  customerId: string;
  customerName: string;
  paymentType:  string; // Extend as needed
  amount: number;
  status: string;     // Extend as needed
  paymentDate: string; // ISO date string
  paymentMethod: string;           // Extend as needed
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};


type Order = {
  InvoiceId: number;
  branch: string;
  status: string;
  orderedFrom: string;
  customerId: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
  salesPersonName: string;
  salesPersonId: string;
  customerLocation: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryDate: string;
  paymentDate: Date | null;
  orderRegisteredBy: string | null;
  trackingToken: string;
  PendingAmount: number;
  PaidAmount: number;
  assignedTo: string | null;
  PaymentdueDate: string;
  items: Item[];
  Customer: Customer;
  SalesPerson: SalesPerson;
  Transactions:Transaction[]
};

type orderData = Order[];

export {type Order, type orderData, type SalesPerson,type Customer,type Item, type Transaction}