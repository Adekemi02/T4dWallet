export type EmailTemplateKeys = 'confirmEmail' | 'forgotPasswordEmail' | 'otpEmail' | 'transferEmail' | 'creditEmail' | 'fundEmail';

export interface IEmailPayload {
     [key: string]: string;
 }

 export interface IMailData {
     templateKey: EmailTemplateKeys,
     placeholders: IEmailPayload,
     subject: string,
     email: string
 }