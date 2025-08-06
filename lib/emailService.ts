// lib/emailService.ts
import nodemailer, { Transporter, TransportOptions } from 'nodemailer';
// Interface for email payload
interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Interface for email response
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Type for SMTP config with Gmail-specific settings
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create SMTP configuration specifically for Gmail
const createSMTPConfig = (): SMTPConfig => {
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASSWORD;
  
  if (!user || !pass) {
    throw new Error('SMTP credentials are not properly configured');
  }

  return {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user,
      pass,
    }
  };
};

// Create transporter with enhanced error handling
export const createTransporter = (): Transporter => {
  try {
    const config = createSMTPConfig();
    console.log('Creating SMTP transport with config:', {
      ...config,
      auth: {
        user: config.auth.user,
        pass: '[HIDDEN]' // Hide password in logs
      }
    });
    return nodemailer.createTransport(config as TransportOptions);
  } catch (error) {
    console.error('Failed to create SMTP transport:', error);
    throw error;
  }
};

// Get transporter instance
export const transporter = createTransporter();

// Email sending function with improved error handling
export const sendEmail = async ({ to, subject, html }: EmailPayload): Promise<EmailResponse> => {
  try {
    // Validate configuration before proceeding
    if (!validateEmailConfig()) {
      throw new Error('Email configuration is invalid');
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('SMTP_FROM_EMAIL environment variable is not set');
    }

    // Log connection attempt (without sensitive data)
    console.log('Attempting to verify SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Send email
    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Email sending failed:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Enhanced email config validation matching your env variables
export const validateEmailConfig = (): boolean => {
  const requiredEnvVars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_EMAIL',
    'SMTP_PASSWORD',
    'SMTP_FROM_EMAIL',
  ];

  const missingVars = requiredEnvVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });

  if (missingVars.length > 0) {
    console.error('Missing or empty required environment variables:', missingVars);
    return false;
  }

  // Validate port number
  const port = parseInt(process.env.SMTP_PORT || '', 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    console.error('Invalid SMTP_PORT value');
    return false;
  }

  return true;
};
