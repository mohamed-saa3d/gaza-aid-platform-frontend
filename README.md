# Qaza Platform - Frontend Client

## 📝 Overview
The frontend client for the **Qaza Charity Donation Platform**. Built on the bleeding edge of the React ecosystem using **Next.js 16 (App Router)** and **React 19**, this application is engineered for high performance, strict type safety, and exceptional scalability. 

The architecture has evolved into a **Domain-Driven Component pattern**, cleanly separating Server Components (Routing/Layouts) from Smart Client Features and pure Presentation layers.

## 🛠️ Technology Stack
This project leverages a highly modern and strictly typed stack:

### Core Frameworks
* **Framework:** [Next.js 16.3](https://nextjs.org/) (App Router Paradigm)
* **Library:** [React 19](https://react.dev/) & React DOM 19
* **Language:** TypeScript 5.7 (Strict Mode)

### Styling & UI
* **CSS Framework:** [Tailwind CSS 4.3](https://tailwindcss.com/) (with PostCSS)
* **Component Library:** [Shadcn UI](https://ui.shadcn.com/)
* **Headless UI:** Base UI (`@base-ui/react`), Radix UI primitives
* **Icons & Animation:** `lucide-react`, `tw-animate-css`
* **Data Visualization:** `recharts` 3.8

### Forms, State & Data Fetching
* **Form Handling:** `react-hook-form` 7.85
* **Validation:** `zod` 4.4 (integrated via `@hookform/resolvers`)
* **HTTP Client:** `axios` 1.19
* **Notifications:** `sonner` (Toast management)

---

## 🏗️ Architectural Pattern: Domain-Driven Components

To maintain a scalable codebase without the overhead of overly complex FSD (Feature-Sliced Design), we enforce a structured boundary between **Routing**, **Domain Logic**, and **UI Primitives**.

### 1. The Routing Layer (`/app`)
Files inside the `app/` directory are primarily **Server Components**. Their sole responsibility is:
* Defining the application routes (URLs).
* Managing page layouts and metadata.
* Executing initial server-side data fetching.
* Rendering the appropriate Domain Feature component.
*(No complex client state or heavy UI logic lives here).*

### 2. The Domain Features Layer (`/components/[domain]`)
This is where the "Smart" business logic lives. Features are grouped by their business domain (e.g., `admin`, `auth`, `donate`, `projects`).
* Contains Client Components (`"use client"`).
* Handles forms, state management, API interactions, and business rules specific to that domain.

### 3. The Shared UI Layer (`/components/ui`)
Purely presentational "Dumb" components (Buttons, Inputs, Dialogs). 
* Driven by Shadcn UI and Radix.
* No API calls, no domain-specific logic.

### 🏛️ Micro-Architecture Example (The Admin Dashboard)
Here is how concerns are separated using the `admin/projects` module as an example:

src/
├── app/
│   └── admin/
│       └── content/
│           └── page.tsx           # 🟢 SERVER COMPONENT: Handles layout & page composition
│
└── components/
    ├── ui/                        # ⚪ DUMB COMPONENTS: Standard generic elements
    │   ├── button.tsx             
    │   └── dialog.tsx             
    │
    └── admin/                     # 🔵 SMART DOMAIN: Specific to the Admin panel
        └── content/
            ├── projects-section.tsx      # Fetches logic, pagination, search state
            ├── create-project-dialog.tsx # Form logic + Zod validation + API POST
            ├── update-project-dialog.tsx # Form logic + API PUT
            └── delete-project-dialog.tsx # Deletion logic + API DELETE
📂 Project Structure Overview
Plaintext
/
├── app/                      # Next.js App Router (Pages, Layouts, Error boundaries)
│   ├── (public)/             # e.g., donate, news, projects, about
│   └── admin/                # Protected admin dashboard routes
│
├── components/               # All components (UI + Domain specific)
│   ├── ui/                   # Reusable Shadcn/Radix components
│   ├── admin/                # Admin dashboard specific features
│   ├── donate/               # Multi-step donation flow components
│   ├── auth/                 # Login, Registration, OTP components
│   └── [other-domains]/      # home, profile, live, projects, etc.
│
├── hooks/                    # Custom React hooks (e.g., use-debounce)
├── lib/                      # Utilities & Configurations
│   ├── api/client.ts         # Centralized Axios instance with interceptors
│   ├── validations/          # Zod validation schemas
│   └── utils.ts              # cn() utility for tailwind-merge
│
├── services/                 # API service layers (e.g., projects.service.ts)
├── types/                    # Global TypeScript interfaces and generic models
└── public/                   # Static assets (Images, Icons)
⚙️ Technical Specifications
API Integration & Services
All HTTP requests are routed through a centralized Axios instance (lib/api/client.ts).

Endpoints are abstracted into Service classes/objects (e.g., services/projects.service.ts).

The client supports withCredentials: true for secure, HTTP-only cookie management and automatic Bearer token injection.

Form Architecture
Forms strictly follow the RHF + Zod pattern:

Define a strictly typed Zod schema in lib/validations/.

Infer the TypeScript type directly from the Zod schema.

Pass the schema to react-hook-form via @hookform/resolvers/zod.

Provide feedback using sonner toasts and inline RHF errors.

Code Quality & Formatting
Strict TypeScript configurations ("strict": true).

ESLint is configured to catch architectural violations (e.g., importing Server Components into Client Components).

🚀 Environment Setup & Execution
Prerequisites
Node.js: v20+ recommended.

Package Manager: pnpm (Required, as per pnpm-lock.yaml and package overrides).

1. Environment Variables
Create a .env.local file in the root directory:

Code snippet
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
# Add other required environment variables here
2. Installation & Scripts
Bash
# Install dependencies strictly using the pnpm lockfile
pnpm install

# Run the development server
pnpm dev

# Build the application for production
pnpm build

# Start the production server
pnpm start

# Run the linter
pnpm lint
