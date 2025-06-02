// Configuration management for environment variables
export const config = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/recipehub",
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },

  // Email
  email: {
    host: process.env.EMAIL_SERVER_HOST,
    port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    user: process.env.EMAIL_SERVER_USER,
    password: process.env.EMAIL_SERVER_PASSWORD,
    from: process.env.EMAIL_FROM || "noreply@recipehub.com",
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
  },

  // Real-time features
  realtime: {
    pollingInterval: Number.parseInt(process.env.REALTIME_POLLING_INTERVAL || "10000"),
    presenceTimeout: Number.parseInt(process.env.PRESENCE_TIMEOUT || "120000"),
    activityRetentionDays: Number.parseInt(process.env.ACTIVITY_LOG_RETENTION_DAYS || "30"),
  },

  // Application
  app: {
    name: process.env.APP_NAME || "RecipeHub",
    url: process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
    supportEmail: process.env.SUPPORT_EMAIL || "support@recipehub.com",
  },

  // Feature flags
  features: {
    realTimeSync: process.env.ENABLE_REAL_TIME_SYNC !== "false",
    emailInvitations: process.env.ENABLE_EMAIL_INVITATIONS !== "false",
    activityLogging: process.env.ENABLE_ACTIVITY_LOGGING !== "false",
    presenceTracking: process.env.ENABLE_PRESENCE_TRACKING !== "false",
  },

  // Development
  dev: {
    nodeEnv: process.env.NODE_ENV || "development",
    debugMode: process.env.DEBUG_MODE === "true",
    logLevel: process.env.LOG_LEVEL || "info",
  },

  // Validation
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
}

// Validate required environment variables
export function validateConfig() {
  const required = ["MONGODB_URI", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  // Warn about optional but recommended variables
  const recommended = ["EMAIL_SERVER_HOST", "EMAIL_SERVER_USER", "EMAIL_SERVER_PASSWORD"]

  const missingRecommended = recommended.filter((key) => !process.env[key])

  if (missingRecommended.length > 0 && config.isProduction) {
    console.warn(`Missing recommended environment variables: ${missingRecommended.join(", ")}`)
    console.warn("Email invitations will not work without email configuration")
  }
}
