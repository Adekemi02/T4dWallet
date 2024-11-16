import nodemailer, { SendMailOptions, Transporter } from "nodemailer";
import { readEmailTemplate } from "../helper.functions";
import { IForgotPasswordMail, ISignupMail } from "../types";
import { EmailTemplateKeys, IEmailPayload, IMailData } from "./types";


/**
 * Sends an email using a specified SMTP transporter.
 * 
 * This function uses the nodemailer package to create a transport for sending emails
 * via the Brevo SMTP relay. It retrieves authentication credentials from environment variables
 * and logs the status of the email sending process.
 * 
 * @param options - The options for the email to be sent, which should conform to the 
 *                  SendMailOptions interface provided by nodemailer. This includes fields 
 *                  like the recipient's email address, subject, and body of the email.
 * 
 * @returns A Promise that resolves to void when the email has been processed.
 *          Note: The actual sending is handled asynchronously and logged via callbacks.
 */
export const sendMail = async (options: SendMailOptions): Promise<void> => {

     console.log(process.env.BREVO_USER);
     console.log(process.env.BREVO_PASS);

     const transporter: Transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 465,
          auth: {
               user: process.env.BREVO_USER,
               pass: process.env.BREVO_PASS
          },
     });

     transporter.sendMail(options, (err, info) => {
          if (err) {
               console.error('Failed to send email:', err);
          } else {
               console.log('Email sent:', info.response);
          }
     });
};

/**
 * Sends a dynamic email based on the provided template and payload.
 *
 * @param templateKey - The key identifying the email template to use.
 * @param payload - The data to populate the template placeholders.
 * @param subject - The subject of the email.
 * @param email - The recipient's email address.
 * @returns A Promise that resolves to a string indicating the status of the email delivery.
 */
export async function sendEMail(
 payload: IMailData
): Promise<string> {
    // Load the specified email template
    const emailTemplate = readEmailTemplate(payload.templateKey);

    // Replace placeholders dynamically
    let emailContent = emailTemplate;
    for (const [key, value] of Object.entries(payload.placeholders)) {
        emailContent = emailContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const mailOptions: SendMailOptions = {
        from: '"Td4Wallet" <td4wallet@gmail.com>',
        to: payload.email,
        subject: payload.subject,
        html: emailContent,
    };

    // Send the email
    await sendMail(mailOptions);

    return "Email Delivered";
}