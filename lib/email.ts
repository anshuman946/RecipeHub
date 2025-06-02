// Email service for sending collaboration invitations
import { config } from "./config"

interface CollaborationInviteData {
  to: string
  recipeName: string
  inviterName: string
  message: string
  invitationId: string
  recipeId: string
}

export async function sendCollaborationInvite(data: CollaborationInviteData) {
  // Check if email is configured
  if (!config.features.emailInvitations) {
    console.log("Email invitations disabled via feature flag")
    return false
  }

  if (!config.email.host && !config.email.sendgridApiKey && !config.email.resendApiKey) {
    console.log("No email service configured - skipping email send")
    return false
  }

  console.log("Sending collaboration invite email:", {
    to: data.to,
    recipeName: data.recipeName,
    inviterName: data.inviterName,
  })

  try {
    // Option 1: Nodemailer (SMTP)
    if (config.email.host && config.email.user && config.email.password) {
      return await sendWithNodemailer(data)
    }

    // Option 2: SendGrid
    if (config.email.sendgridApiKey) {
      return await sendWithSendGrid(data)
    }

    // Option 3: Resend
    if (config.email.resendApiKey) {
      return await sendWithResend(data)
    }

    console.warn("No email service properly configured")
    return false
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

async function sendWithNodemailer(data: CollaborationInviteData) {
  const nodemailer = require("nodemailer")

  const transporter = nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  })

  await transporter.sendMail({
    from: config.email.from,
    to: data.to,
    subject: `You've been invited to collaborate on "${data.recipeName}"`,
    html: generateInviteEmailHTML(data),
  })

  return true
}

async function sendWithSendGrid(data: CollaborationInviteData) {
  const sgMail = require("@sendgrid/mail")
  sgMail.setApiKey(config.email.sendgridApiKey)

  await sgMail.send({
    to: data.to,
    from: config.email.from,
    subject: `You've been invited to collaborate on "${data.recipeName}"`,
    html: generateInviteEmailHTML(data),
  })

  return true
}

async function sendWithResend(data: CollaborationInviteData) {
  const { Resend } = require("resend")
  const resend = new Resend(config.email.resendApiKey)

  await resend.emails.send({
    from: config.email.from,
    to: data.to,
    subject: `You've been invited to collaborate on "${data.recipeName}"`,
    html: generateInviteEmailHTML(data),
  })

  return true
}

function generateInviteEmailHTML(data: CollaborationInviteData): string {
  const acceptUrl = `${config.app.url}/invitations/${data.invitationId}/accept`
  const declineUrl = `${config.app.url}/invitations/${data.invitationId}/decline`
  const recipeUrl = `${config.app.url}/recipes/${data.recipeId}`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recipe Collaboration Invitation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 12px 24px; margin: 10px 5px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .accept { background: #22c55e; color: white; }
        .decline { background: #ef4444; color: white; }
        .view { background: #3b82f6; color: white; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍳 ${config.app.name} Collaboration Invitation</h1>
        </div>
        <div class="content">
          <h2>You've been invited to collaborate!</h2>
          <p><strong>${data.inviterName}</strong> has invited you to collaborate on the recipe:</p>
          <h3>"${data.recipeName}"</h3>
          
          ${data.message ? `<p><em>Personal message:</em><br>"${data.message}"</p>` : ""}
          
          <p>As a collaborator, you'll be able to:</p>
          <ul>
            <li>Edit recipe ingredients and instructions</li>
            <li>Add your own cooking tips and variations</li>
            <li>Help improve the recipe together</li>
            <li>See real-time updates from other collaborators</li>
          </ul>
          
          <p><strong>Important:</strong> ${data.inviterName} will always be credited as the original recipe creator.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${acceptUrl}" class="button accept">Accept Invitation</a>
            <a href="${declineUrl}" class="button decline">Decline</a>
          </div>
          
          <p>You can also <a href="${recipeUrl}" class="button view">view the recipe</a> before deciding.</p>
          
          <p><small>This invitation will expire in 7 days.</small></p>
        </div>
        <div class="footer">
          <p>Happy cooking!<br>The ${config.app.name} Team</p>
          <p><a href="mailto:${config.app.supportEmail}">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}
