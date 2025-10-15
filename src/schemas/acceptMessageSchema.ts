import { z } from "zod";

export const acceptMessageSchema = z.object({
    messagesAccept: z.boolean()
});