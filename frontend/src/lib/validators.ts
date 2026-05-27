import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(4000),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(300),
  description: z.string().min(1),
  tech_stack: z.array(z.string()),
});
