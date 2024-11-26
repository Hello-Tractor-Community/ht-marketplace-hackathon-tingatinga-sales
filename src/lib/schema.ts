import { z } from "zod";

export const SellerProfileSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  description: z.string().optional().default(""),
  address: z.string().optional().default(""),
  country: z.string().optional().default(""),
  region: z.string().optional().default(""),
  city: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email format"),
  website: z.string().url("Invalid URL").optional(),
  socialLinks: z.array(z.string().url("Invalid URL")).optional().default([]),
  preferred_contact_method: z.enum(["Email", "Phone", "WhatsApp"]).optional(),
  bannerImageUrl: z.string().url("Invalid URL").optional(),
  tagline: z.string().optional().default(""),
  shippingPolicy: z.string().optional().default(""),
  returnPolicy: z.string().optional().default(""),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  description: z.string().min(1, "Product Description is required"),
  content: z.string().min(1, "Product Content is required"),
  categoryId: z.string().min(1, "Category is required"),
  images: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one image is required"),
  currency: z.string().min(1, "Currency is required"),
  price: z.coerce.number().min(0, "Price must be greater than 0"),
  stockQuantity: z.coerce.number().min(0, "Stock must be greater than 0"),
  availabilityStatus: z.string().min(1, "Availability Status is required"),
});

export const TractorSchema = ProductSchema.extend({
  engineTypeId: z.string().min(1, "Engine Type is required"),
  horsePower: z.coerce.number().min(0, "Horse Power must be greater than 0"),
  fuelCapacity: z.coerce
    .number()
    .min(0, "Fuel Capacity must be greater than 0"),
  maxSpeed: z.coerce.number().min(0, "Max Speed must be greater than 0"),
  transmissionType: z.string().min(1, "Transmission Type is required"),
  wheelType: z.string().min(1, "Wheel Type is required"),
  attachmentsCompatible: z.array(z.string()).optional().default([]),
  operatingWeight: z.coerce
    .number()
    .min(0, "Operating Weight must be greater than 0"),
  serialNumber: z.string().min(1, "Serial Number is required"),
  availabilityStatus: z.string().min(1, "Availability Status is required"),

  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Year must be after 1900"),
  hoursUsed: z.coerce.number().min(0, "Hours Used must be greater than 0"),
  condition: z.enum(["new", "used"]),
  warranty: z.string().optional().default(""),
});

export const ReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(1, "Review text is required"),
});

export const UserSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category Name is required"),
  description: z.string().min(1, "Category Description is required"),
  verified: z.boolean().optional().default(false),
});

export const engineTypeSchema = z.object({
  name: z.string().min(1, "Engine Type Name is required"),
  description: z.string().min(1, "Engine Type Description is required"),
  verified: z.boolean().optional().default(false),
});


export const userSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().url("Invalid image url")
})
