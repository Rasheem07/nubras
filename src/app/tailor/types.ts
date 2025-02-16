// types.ts
export interface Order {
    InvoiceId: string;
    customerName: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    status: 'confirmed' | 'in_progress' | 'completed';
    deliveryDate?: Date;
    assignedTo?: string;
  }
  
  export interface Measurement {
    id: string;
    orderId: string;
    productName: string;
    LengthInFront: number;
    lengthBehind: number;
    shoulder: number;
    hands: number;
    neck: number;
    middle: number;
    chest: number;
    endOfShow: number;
    notes?: string;
  }
  
  export interface Task {
    id: string;
    orderId: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
    assignedTo?: string;
  }
  
  export interface Salary {
    id: string;
    orderId: string;
    employeeId: string;
    amount: number;
    createdAt: Date;
  }