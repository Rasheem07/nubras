
interface Order {
    InvoiceId: string;
    date: Date;
    branch: string;
    status: string;
    orderedFrom: string;
    customerName: string;
    customerLocation: string;
    paymentStatus: string;
    productName: string;
    productPrice: number;
    salesPersonName: string;
    quantity: number;
    totalAmount: number;
    PendingAmount: number,
    PaidAmount: number;
    deliveryDate?: Date;
    paymentDate?: Date;
    orderRegisteredBy?: string;
  }
  export default Order;