import { z } from "zod";

export enum ServiceType {
  READY_MADE = "READY_MADE",
  CUSTOM_MADE = "CUSTOM_MADE",
  BOTH = "BOTH"
}

export const serviceFormSchema = z.object({
  name: z.string()
    .min(3, "Service name must be at least 3 characters")
    .max(50, "Service name must be less than 50 characters"),
  type: z.nativeEnum(ServiceType),
  costingPrice: z.number().min(1),
  price: z.number()
    .min(0, "Price must be greater than 0")
    .max(999999, "Price must be less than 1,000,000"),
  sectionName: z.string()
    .min(1, "Section is required"),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;