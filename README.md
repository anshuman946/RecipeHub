# RecipeHub - Collaborative Recipe Builder

A collaborative recipe platform where users can create, share, and perfect recipes together with real-time collaboration, automatic ingredient scaling, and built-in cooking timers.

## Features

### 🔐 Authentication & Authorization
- Email/password authentication
- User roles (Owner, Collaborator, Viewer)
- Public and private recipe visibility

### 📝 Recipe Management
- Create, read, update, delete recipes
- Rich recipe editor with ingredients and step-by-step instructions
- Tag system for categorization
- Recipe search and filtering

### 📏 Smart Ingredient Scaling
- Automatic quantity recalculation based on serving size
- Maintains proper ratios for all ingredients
- Real-time updates as you adjust servings

### ⏱️ Built-in Cooking Timers
- Step-by-step timers for each instruction
- Visual and audio alerts when timers complete
- Multiple timer support
- Pause, resume, and reset functionality

### 👥 Real-time Collaboration
- Invite collaborators by email
- Original recipe author gets default credit
- Real-time updates (simulated with polling)
- Collaborative editing with version tracking

### 🎨 Modern UI/UX
- Responsive design for all devices
- Clean, intuitive interface
- Progress tracking for cooking steps
- Dark/light mode support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React hooks and local state
- **Authentication**: Custom implementation (demo mode)
- **Database**: Mock data (ready for real database integration)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd recipehub
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Account
For testing purposes, use these credentials:
- **Email**: demo@recipehub.com
- **Password**: demo123

## Project Structure

\`\`\`
recipehub/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx        # User dashboard
│   ├── recipes/                  # Recipe-related pages
│   │   ├── new/page.tsx         # Create new recipe
│   │   ├── [id]/page.tsx        # View recipe
│   │   └── page.tsx             # Browse recipes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utility functions
└── public/                      # Static assets
\`\`\`

## Key Features Implementation

### 1. Recipe Scaling Algorithm
\`\`\`typescript
const scaleIngredient = (originalQuantity: number, originalServings: number, newServings: number) => {
  return (originalQuantity * newServings / originalServings).toFixed(2).replace(/\.?0+$/, '')
}
\`\`\`

### 2. Timer System
- Each recipe step can have an optional timer
- Timers run independently with visual countdown
- Audio/visual alerts on completion
- Pause/resume/reset functionality

### 3. Collaboration Features
- Recipe ownership and permissions
- Collaborator invitation system
- Real-time updates (simulated)
- Version control ready

### 4. Progress Tracking
- Visual progress bar for recipe completion
- Step-by-step completion tracking
- Cooking session management

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## Environment Variables

For production deployment, you'll need:

\`\`\`env
# Database
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=your_domain

# Email (for invitations)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email
EMAIL_SERVER_PASSWORD=your_password
EMAIL_FROM=noreply@recipehub.com
\`\`\`

## Future Enhancements

### Phase 1 (Database Integration)
- [ ] PostgreSQL/Supabase integration
- [ ] Real user authentication
- [ ] Persistent data storage

### Phase 2 (Real-time Features)
- [ ] WebSocket integration for real-time collaboration
- [ ] Live cursor tracking
- [ ] Conflict resolution

### Phase 3 (Advanced Features)
- [ ] Recipe versioning and history
- [ ] Photo upload for recipes
- [ ] Nutrition calculation
- [ ] Meal planning
- [ ] Shopping list generation
- [ ] Recipe rating and reviews

### Phase 4 (Social Features)
- [ ] User profiles
- [ ] Recipe collections
- [ ] Social sharing
- [ ] Recipe recommendations
- [ ] Community features

## API Integration Ready

The application is structured to easily integrate with a real backend:

\`\`\`typescript
// Example API integration points
const createRecipe = async (recipeData) => {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipeData)
  })
  return response.json()
}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**RecipeHub** - Where culinary creativity meets collaborative innovation! 🍳👨‍🍳👩‍🍳
