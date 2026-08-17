### 2. Frontend README (Next.js / App Router)

```markdown
# Qaza Platform - Frontend Client

## Overview
The frontend client for the Qaza charity donation platform. Built with Next.js (App Router) and React, this application adheres to a Feature-Sliced Design (FSD) approach, separating "Smart" module logic from "Dumb" presentational UI components.

## Technology Stack
* Framework: Next.js (App Router)
* Language: TypeScript
* Styling: Tailwind CSS
* UI Components: Radix UI / Shadcn UI
* Form Handling: React Hook Form
* Validation: Zod
* HTTP Client: Axios

## Architectural Pattern
The project enforces a strict modular architecture to ensure scalability and maintainability:
* UI/Common Components (`/components`): Purely presentational ("Dumb") components. No business logic, no API calls, no state handling.
* Feature Modules (`/modules`): Contains the business logic ("Smart" components). Includes forms, state management, custom hooks, and Zod schemas.

## Project Structure
```text
/
├── app/                # Next.js App Router pages and layout
├── components/         # Global presentational components
│   ├── layout/         # Headers, Footers, Navigation
│   └── ui/             # Reusable Shadcn UI components (Buttons, Inputs, etc.)
├── lib/                # Global utilities and configurations
│   ├── api/            # Centralized Axios client and interceptors
│   └── utils.ts        # Helper functions (e.g., Tailwind class merging)
├── modules/            # Feature-sliced modules containing business logic
│   ├── auth/           # Auth components, schemas, hooks, and types
│   └── donation/       # Donation flow components, schemas, hooks, and types
└── public/             # Static assets
```

Technical Specifications
API Integration: All HTTP requests are routed through a centralized Axios instance (lib/api/client.ts). The instance is configured with withCredentials: true to support HTTP-only cookies and includes an interceptor to attach the Bearer token.

Localization (i18n): The application supports full Bidirectional (RTL/LTR) layouts. Static text localization is managed via an internal dictionary system integrated with the Next.js layout context.

Form Validation: Forms are validated on the client side using Zod schemas tightly coupled with React Hook Form resolvers to prevent malformed API requests.

Environment Setup
Create a .env.local file in the root directory:

مقتطف الرمز
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
Installation & Execution
Bash
# Install dependencies strictly using the frozen lockfile
npm install

# Run the development server
npm run dev

# Build for production
npm run build
