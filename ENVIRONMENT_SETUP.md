# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Generate NextAuth secret:**
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`

3. **Fill in your MongoDB URI and other required values**

## Required Variables

### 🔐 **Authentication**
\`\`\`env
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 🗄️ **Database**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/recipehub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipehub
\`\`\`

## Optional Variables

### 📧 **Email (for collaboration invitations)**

Choose ONE email provider:

#### Gmail/Google Workspace
\`\`\`env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@recipehub.com
\`\`\`

#### SendGrid
\`\`\`env
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@recipehub.com
\`\`\`

#### Resend
\`\`\`env
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@recipehub.com
\`\`\`

### ⚡ **Real-time Features**
\`\`\`env
REALTIME_POLLING_INTERVAL=10000      # 10 seconds
PRESENCE_TIMEOUT=120000              # 2 minutes
ACTIVITY_LOG_RETENTION_DAYS=30       # 30 days
\`\`\`

### 🎛️ **Feature Flags**
\`\`\`env
ENABLE_REAL_TIME_SYNC=true
ENABLE_EMAIL_INVITATIONS=true
ENABLE_ACTIVITY_LOGGING=true
ENABLE_PRESENCE_TRACKING=true
\`\`\`

## Environment-Specific Configurations

### Development (.env.local)
- Use local MongoDB or free MongoDB Atlas cluster
- Shorter polling intervals for testing
- Debug mode enabled
- Test email credentials

### Production (.env.production)
- MongoDB Atlas with proper security
- Longer polling intervals to reduce server load
- Production email service
- Error logging only
- Strong secrets different from development

## Email Setup Instructions

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an "App Password"
3. Use the app password in \`EMAIL_SERVER_PASSWORD\`

### SendGrid Setup
1. Create SendGrid account
2. Generate API key
3. Verify sender identity

### Resend Setup
1. Create Resend account
2. Generate API key
3. Add domain (optional)

## Security Best Practices

1. **Never commit .env files to version control**
2. **Use different secrets for development and production**
3. **Rotate secrets regularly**
4. **Use strong, random passwords**
5. **Restrict MongoDB access by IP in production**

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify network access (Atlas)
   - Ensure MongoDB is running (local)

2. **NextAuth Errors**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Clear browser cookies

3. **Email Not Sending**
   - Check email credentials
   - Verify SMTP settings
   - Check spam folder
   - Ensure feature flag is enabled

### Environment Validation

The app automatically validates required environment variables on startup. Check the console for any missing variables.

## Feature Configuration

### Disable Real-time Features
\`\`\`env
ENABLE_REAL_TIME_SYNC=false
ENABLE_PRESENCE_TRACKING=false
\`\`\`

### Disable Email Features
\`\`\`env
ENABLE_EMAIL_INVITATIONS=false
\`\`\`

### Adjust Performance
\`\`\`env
# Slower polling for better performance
REALTIME_POLLING_INTERVAL=30000

# Shorter presence timeout
PRESENCE_TIMEOUT=60000
\`\`\`

## Deployment Platforms

### Vercel
Add environment variables in the Vercel dashboard under Settings → Environment Variables.

### Railway
Use the Railway dashboard or CLI to set environment variables.

### Docker
Create a \`.env\` file or pass variables via \`docker run -e\`.

## Support

If you need help with environment setup:
1. Check the console for validation errors
2. Review this guide
3. Check the GitHub issues
4. Contact support at the configured \`SUPPORT_EMAIL\`
\`\`\`
