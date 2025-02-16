// types.ts
export enum EmployeeRole {
    MASTER_TAILOR = 'MASTER_TAILOR',
    TAILOR = 'TAILOR'
  }

  
  export interface Employee {
    id?: string;
    name: string;
    role: EmployeeRole;
    contact: number;
    areaCode: string;
  }
  
  // employeeSchema.ts
  import { z } from 'zod';
  
  export const employeeSchema = z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    role: z.enum(['MASTER_TAILOR', 'TAILOR'], {
      required_error: 'Please select a role',
    }),
    contact: z.string()

      .min(9, 'Contact number must be at least 9 digits')
      .max(15, 'Contact number must be less than 15 digits'),
    areaCode: z.string()
      .default('+971'),
  });

  
  export type EmployeeFormData = z.infer<typeof employeeSchema>;