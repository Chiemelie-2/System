// lib/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.EMAIL_FROM || 'BankingSim <noreply@bankingsim.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Base email template
function emailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f, #1e40af); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🏦 BankingSim</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} BankingSim. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0;">
                This is a simulation platform. No real financial transactions are processed.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

// Verification Email
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`
  
  const content = `
    <h2 style="color: #1e3a5f; margin-top: 0;">Verify Your Email Address</h2>
    <p style="color: #4b5563; line-height: 1.6;">Welcome to BankingSim! Please verify your email address to activate your account.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Verify Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
    
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 20px; border-radius: 4px;">
      <p style="color: #92400e; font-size: 13px; margin: 0;">
        <strong>Note:</strong> This is a simulation platform for educational and portfolio purposes only.
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your email - BankingSim',
      html: emailWrapper(content),
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw error
  }
}

// Password Reset Email
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`
  
  const content = `
    <h2 style="color: #1e3a5f; margin-top: 0;">Reset Your Password</h2>
    <p style="color: #4b5563; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; border-radius: 4px;">
      <p style="color: #991b1b; font-size: 13px; margin: 0;">
        <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore and ensure your account is secure.
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your password - BankingSim',
      html: emailWrapper(content),
    })
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}

// Account Approved Email
export async function sendAccountApprovedEmail(email: string, accountNumber: string, firstName: string) {
  const content = `
    <h2 style="color: #1e3a5f; margin-top: 0;">🎉 Account Approved!</h2>
    <p style="color: #4b5563; line-height: 1.6;">Great news, ${firstName}! Your account has been verified and approved.</p>
    
    <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="color: #065f46; font-size: 14px; margin: 0 0 10px;">Your Account Number</p>
      <p style="color: #1e3a5f; font-size: 28px; font-weight: bold; font-family: 'Courier New', monospace; margin: 0; letter-spacing: 2px;">
        ${accountNumber}
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/dashboard" 
         style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Go to Dashboard
      </a>
    </div>
    
    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; margin-top: 20px; border-radius: 4px;">
      <p style="color: #1e40af; font-size: 13px; margin: 0;">
        <strong>📌 Remember:</strong> This is a simulation platform. Your balance starts at $0.00. An administrator can add virtual funds for demonstration purposes.
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Account Approved - Welcome to BankingSim!',
      html: emailWrapper(content),
    })
  } catch (error) {
    console.error('Failed to send approval email:', error)
    throw error
  }
}

// KYC Rejected Email
export async function sendKYCRejectedEmail(email: string, firstName: string, reason: string) {
  const content = `
    <h2 style="color: #1e3a5f; margin-top: 0;">Account Verification Update</h2>
    <p style="color: #4b5563; line-height: 1.6;">Hi ${firstName}, your account verification requires additional attention.</p>
    
    <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="color: #991b1b; font-size: 14px; margin: 0 0 5px;"><strong>Reason:</strong></p>
      <p style="color: #7f1d1d; font-size: 14px; margin: 0;">${reason}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}/login" 
         style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Log In to Update
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">Please log in to your account to view details and resubmit your documents.</p>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Account Verification Update - BankingSim',
      html: emailWrapper(content),
    })
  } catch (error) {
    console.error('Failed to send rejection email:', error)
    throw error
  }
}