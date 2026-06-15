import { z } from "zod";

export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format');

export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character');

export const usernameSchema = z
     .string()
     .min(4, 'Username must be at least 4 characters')
     .max(20, 'Username must be less then 20 characters')
     .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const phoneSchema = z
  .string()
  .min(11, 'Phone number must be 11 digits')
  .max(14, 'Phone number is too long')
  .regex(
    /^(?:\+8801|01)[3-9]\d{8}$/,
    'Invalid Bangladeshi phone number'
  );

export const ageSchema = z
    .number()
    .min(16, 'Must be at least 16 years old')
    .max(120, 'Must be less than 120 years old');

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    userName:usernameSchema,
    fullName: z.string().min(4, 'Full name is required').max(20),
    age: ageSchema,
    phoneNumber: phoneSchema,
    address: z.object({
        street: z.string().min(5, 'Street address is required'),
        city: z.string().min(2, 'City is Required'),
        country: z.string().min(2, 'Country is required'),
        zipCode: z.string().regex(/^\d{4}(-\d{4})?$/, 'Invalid zip code format'),
    }),
    newsLetter: z.boolean(),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword'],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
