import { z } from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(1000, "Message content is too long"),
});