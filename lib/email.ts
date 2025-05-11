// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend('re_8MiSSsbD_ELprLVPQXBGcQykQj5k8RnTZ');

interface EmailParams {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailParams) {
    try {
        const response = await resend.emails.send({
            from: "UberX Rider <no-reply@yourdomain.com>", // Replace with your domain
            to,
            subject,
            text,
            html,
        });
        return { success: true, data: response };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}