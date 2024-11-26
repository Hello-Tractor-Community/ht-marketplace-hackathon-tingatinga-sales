import { BillingInfo } from "@/lib/context/types";

export const billingAddresss: BillingInfo[] = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main Street, Springfield, IL 62704",
    phone: "+1-555-123-4567",
    isDefault: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    address: "456 Elm Avenue, Boston, MA 02118",
    phone: "+1-555-987-6543",
    isDefault: false,
  },
  {
    id: 3,
    name: "Michael Johnson",
    address: "789 Oak Street, Seattle, WA 98101",
    phone: "+1-555-246-8101",
    isDefault: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    address: "321 Pine Drive, Denver, CO 80203",
    phone: "+1-555-765-4321",
    isDefault: false,
  },
];
