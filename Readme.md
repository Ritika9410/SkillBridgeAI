# Next.js

A modern Next.js 15 application built with TypeScript and Tailwind CSS.

## 🚀 Features

- **Next.js 15** - Latest version with improved performance and features
- **React 19** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## 🛠️ Installation

1. Install dependencies:

```bash
  npm install
  # or
  yarn install
```

2. Start the development server:

```bash
  npm run dev
  # or
  yarn dev
```

3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## MongoDB Authentication Setup

Registration and sign-in use MongoDB Atlas. Create a database user and add your development IP
address to the Atlas project's IP access list, then copy the Node.js driver connection string into
`.env.local` as `MONGODB_URI`. Set `MONGODB_DB=skillbridgeai`. A local `AUTH_SECRET` is generated in
`.env.local`; do not commit or share that file. Restart the dev server after editing environment
settings. See MongoDB's [Atlas connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)
for the database user, IP access list, and connection string steps.

New registrations create student accounts. TPO access is intentionally not available through public
sign-up.

## Career readiness features

- Resume analysis extracts PDF text on the server, sends the role, resume text, and available profile
  skills/projects to Gemini, then stores the complete analysis result in the authenticated user's
  `resumeAnalyses` MongoDB collection. The PDF itself is not stored.
- The dashboard loads the user's saved analysis history from `/api/resume/latest`; its resume score,
  skill match, score history, and gap list are based on that data and the current profile.
- Student profiles are stored per user in `studentProfiles`. Profile completion is calculated from
  the academic, skills, project, certification, and professional-link fields.
- Gemini generates four-week plans from the latest analysis and profile. The `roadmaps` collection
  stores each user's tasks and completion progress.
- Gemini creates mock interview questions and scores each text answer for communication, technical
  reasoning, and confidence. Sessions and feedback are stored per user in `interviews`.
- `GEMINI_API_KEY` is read only by server routes. Never add a `NEXT_PUBLIC_` prefix or commit
  `.env.local`.

## 📁 Project Structure

The application uses Next.js, so its URL entry points remain in `src/app/`. The rest of the code is
grouped into clear top-level folders:

```text
src/
└── app/                         Next.js pages and required route entry points
    ├── api/                     Thin HTTP adapters for auth, profile, resume, roadmap, interviews
    ├── login/                   Login and registration route
    ├── profile/                 Student profile editor
    ├── mock-interview/          Text interview and AI feedback
    ├── placement-dashboard/     Dashboard route
    └── resume-analyzer/         Resume analyzer route
frontend/
├── components/                  Shared layout, navigation, and UI components
├── features/                    Auth, profile, interviews, dashboard, and resume analyzer UI
└── styles/                      Global styles and Tailwind entry points
backend/
└── api/                         Auth, profile, resume, roadmap, and interview handlers
server/                          MongoDB, Gemini, JWT, and profile utilities
shared/                          Types used across frontend and backend
```

Keep page files and `route.ts` adapters in `src/app` because Next.js discovers URLs there. Put UI in
`frontend/`, request handling in `backend/`, database/session code in `server/`, and shared types in
`shared/`.

## 🧩 Page Editing

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 🎨 Styling

This project uses Tailwind CSS for styling with the following features:

- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

Build the application for production:

```bash
  npm run build
```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🙏 Acknowledgments

- Powered by Next.js and React
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
