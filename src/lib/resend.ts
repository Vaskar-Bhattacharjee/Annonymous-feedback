import { Resend } from 'resend';

export const resend = new Resend(process.env.RESENDER_API_KEY);