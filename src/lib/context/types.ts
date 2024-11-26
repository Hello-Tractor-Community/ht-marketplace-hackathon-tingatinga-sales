import { Category, Product } from "@prisma/client";

export interface BillingInfo {
  id: number;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export type TProduct = Product & {
  category: Category;
};

export interface Option {
  label: string;
  value: string;
}

export interface TractorFilters {
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  hoursUsed?: number;
  country?: string;
  region?: string;
  city?: string;
  category?: string;
  condition?: "new" | "used";
  [key: string]: string | number | undefined; // Allow for dynamic filter keys
}
