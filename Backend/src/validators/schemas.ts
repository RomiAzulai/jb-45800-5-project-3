import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const vacationSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  price: z.number().min(0, 'Price cannot be negative').max(10000, 'Price cannot exceed 10,000'),
});

export const editVacationSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  price: z.number().min(0, 'Price cannot be negative').max(10000, 'Price cannot exceed 10,000'),
});

export const aiRecommendationSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
});

export const mcpQuerySchema = z.object({
  question: z.string().min(1, 'Question is required'),
});
