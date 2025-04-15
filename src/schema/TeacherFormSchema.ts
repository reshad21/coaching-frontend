import { z } from 'zod';

const TeacherRegistrationSchema = z
    .object({
        firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
        lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
        dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
        idNumber: z.string().min(1, { message: "ID number is required" }),
        certificateName: z.string().min(1, { message: "Certificate name is required" }),
        regNumber: z.string().min(1, { message: "Registration number is required" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        phone: z.string().min(1, { message: "Phone number is required" }),
        fatherName: z.string().min(1, { message: "Father's name is required" }),
        motherName: z.string().min(1, { message: "Mother's name is required" }),
        religion: z.string().min(1, { message: "Religion is required" }),
        address: z.string().min(1, { message: "Address is required" }),
        designation: z.literal("Teacher"), // Fixed value
        departmentName: z.string().min(1, { message: "Department name is required" }),
        image: z.any().optional(), // Optional image field
        certificate: z.any().optional(), // Optional certificate field
    });

export default TeacherRegistrationSchema;
