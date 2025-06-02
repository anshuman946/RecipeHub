# RecipeHub - MongoDB Setup Guide

## Prerequisites

1. **Node.js 18+** installed
2. **MongoDB** - Choose one option:
   - **Local MongoDB**: Install MongoDB locally
   - **MongoDB Atlas**: Free cloud database (recommended)

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set role to "Atlas Admin" or "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add your specific IP addresses

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Option 2: Local MongoDB

1. **Install MongoDB**
   \`\`\`bash
   # macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community

   # Ubuntu/Debian
   sudo apt-get install mongodb

   # Windows - Download from mongodb.com
   \`\`\`

2. **Start MongoDB**
   \`\`\`bash
   # macOS/Linux
   mongod

   # Or as a service
   brew services start mongodb/brew/mongodb-community
   \`\`\`

3. **Connection String**
   \`\`\`
   mongodb://localhost:27017/recipehub
   \`\`\`

## Project Setup

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd recipehub
   npm install
   \`\`\`

2. **Environment Variables**
   Create `.env.local` file:
   \`\`\`env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string_here
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

3. **Generate NextAuth Secret**
   \`\`\`bash
   # Generate a random secret
   openssl rand -base64 32
   \`\`\`

4. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access Application**
   - Open http://localhost:3000
   - Register a new account or use existing credentials

## Database Collections

The application will automatically create these collections:

- **users**: User accounts and profiles
- **recipes**: Recipe data with ingredients and steps
- **likes**: Recipe likes/favorites
- **collaborations**: Recipe collaboration data

## Production Deployment

### Environment Variables for Production

\`\`\`env
# MongoDB (Atlas recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipehub

# NextAuth
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.com

# Optional: Email configuration for invitations
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
\`\`\`

### Vercel Deployment

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

### Security Considerations

1. **MongoDB Atlas Security**
   - Use strong passwords
   - Restrict IP access in production
   - Enable MongoDB Atlas security features

2. **NextAuth Security**
   - Use a strong, unique NEXTAUTH_SECRET
   - Configure proper CORS settings
   - Use HTTPS in production

3. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use different secrets for development and production
   - Rotate secrets regularly

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Verify network access settings (Atlas)
   - Ensure MongoDB is running (local)

2. **NextAuth Errors**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Clear browser cookies and try again

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (18+ required)
   - Verify TypeScript configuration

### Database Indexes (Optional Performance Optimization)

\`\`\`javascript
// Connect to MongoDB and run these commands for better performance
db.recipes.createIndex({ "title": "text", "description": "text", "tags": "text" })
db.recipes.createIndex({ "authorId": 1 })
db.recipes.createIndex({ "collaborators": 1 })
db.recipes.createIndex({ "isPublic": 1 })
db.recipes.createIndex({ "createdAt": -1 })
db.users.createIndex({ "email": 1 }, { unique: true })
\`\`\`

## Features Implemented

✅ **Authentication & Authorization**
- User registration and login
- Session management with NextAuth
- Protected routes

✅ **Recipe Management**
- Create, read, update, delete recipes
- Real-time ingredient scaling
- Step-by-step instructions with timers

✅ **Collaboration**
- Add collaborators to recipes
- Permission-based editing
- Recipe sharing

✅ **Database Integration**
- MongoDB with proper schemas
- Optimized queries
- Data validation

✅ **Production Ready**
- Environment configuration
- Security best practices
- Scalable architecture

## Next Steps

1. **Email Integration**: Set up email service for collaboration invitations
2. **Real-time Updates**: Implement WebSocket for live collaboration
3. **File Uploads**: Add recipe image upload functionality
4. **Advanced Features**: Nutrition calculation, meal planning, etc.

For support, please check the GitHub issues or create a new issue.
