import { z } from "zod";

// Constants
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Image Schema
const imageSchema = z
  .any()
  .optional()
  .refine(
    (file) => {
      if (!file) return true; // optional, allow if empty
      
      return ACCEPTED_IMAGE_TYPES.includes(file.mimetype);
    },
    { message: "Only JPG, JPEG, PNG, WEBP formats are allowed" }
  )
  .refine(
    (file) => {
      if (!file) return true;
      
      return file.size <= MAX_FILE_SIZE;
    },
    { message: "Image size must be 1MB or less" }
  );

// Main Form Schema
const AdminFormSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    number: z.string().min(1, { message: "Number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    userRole: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm password is required" }),
    image: imageSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default AdminFormSchema;
