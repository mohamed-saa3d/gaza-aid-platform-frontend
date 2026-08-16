# FRONTEND EXECUTION PLAN
## Elite Frontend Audit, Refactor & Backend Integration

**Status:** Planning Phase Complete  
**Last Updated:** 2026-08-16  
**Target Completion:** Phase 3 (Backend Integration)

---

## EXECUTIVE SUMMARY

This plan outlines the systematic modernization of the Next.js charity donation platform to achieve:
1. ✅ Pixel-perfect UI, mobile, and RTL/LTR localization
2. ✅ Strict modular component architecture (Dumb UI + Smart Feature Components)
3. ✅ Full Express/Prisma backend integration with proper authentication & state management

---

## PHASE 1: PIXEL-PERFECT UI, MOBILE & LOCALIZATION AUDIT

### Issues Found & Proposed Fixes

#### 1.1 RTL/LTR Directional CSS Issues

**Critical Issues:**
- ❌ `ml-auto` (margin-left) in `components/ui/dropdown-menu.tsx` L122 - blocks RTL layout
- ❌ `ml-auto` in `components/ui/accordion.tsx` L36 - accordion icon misaligned in Arabic
- ❌ `mr-72` (margin-right) in `components/admin/admin-shell.tsx` L39 - sidebar offset broken
- ❌ `ml-4` in `components/ui/field.tsx` L202 - list indentation hardcoded

**Proposed Fixes:**
```
ml-auto  → ms-auto   (margin-start, RTL-aware)
mr-72    → me-72     (margin-end, RTL-aware)  
pl-X     → ps-X      (padding-start, RTL-aware)
pr-X     → pe-X      (padding-end, RTL-aware)
```

**Files to Update:**
- `components/ui/dropdown-menu.tsx` (2 instances)
- `components/ui/accordion.tsx` (1 instance)
- `components/admin/admin-shell.tsx` (1 instance)
- `components/ui/field.tsx` (1 instance)

---

#### 1.2 Mobile Touch Target & Accessibility Issues

**Critical Issues:**
- ❌ Button heights too small: `h-8` (32px), `h-7` (28px), `h-6` (24px) in `components/ui/button.tsx`
  - WCAG AA requires minimum 44x44px touch targets on mobile
  - Current: 24-32px (10-25% below standard)
  
- ❌ Input height: `h-8` (32px) in `components/ui/input.tsx`
  - Should be 44-48px minimum on mobile viewports
  
- ❌ OTP input slots: `size-12` (48px) - acceptable but could be larger
  - Consider 52-56px on mobile for better UX

- ❌ Mobile button padding insufficient in donation flow:
  - Buttons in `components/donate/amount-step.tsx` (reason selection buttons) are too small
  - Quick amount buttons grid has `gap-3` but buttons need internal padding

**Proposed Fixes:**
1. Add responsive sizes to button component:
   ```tsx
   // New responsive sizes
   "md": "h-10 gap-2 px-3"        // Mobile: 40px
   "lg": "h-11 gap-2 px-4"        // Tablet/Desktop: 44px+
   ```

2. Update input component mobile height:
   ```tsx
   // Mobile-first approach
   "min-h-10 md:h-8"  // 40px on mobile, 32px on desktop
   ```

3. Ensure minimum 8px padding inside buttons/inputs across all sizes

**Files to Update:**
- `components/ui/button.tsx` - Add responsive sizing
- `components/ui/input.tsx` - Add responsive height
- `components/donate/amount-step.tsx` - Verify button spacing
- `app/donate/page.tsx` - Check grid layouts

---

#### 1.3 Responsive Overflow & Mobile Layout Issues

**Issues Found:**
- ⚠️ Admin shell sidebar: `lg:mr-72` - right margin is absolute, no fallback for small screens
  - Mobile will render incorrectly without the sidebar being hidden first
  
- ⚠️ Hero section gradient overlay positioning:
  - `components/home/hero-section.tsx` - `absolute inset-x-0 bottom-0` may overflow on small screens
  - Text "h-[420px] ... sm:h-[480px]" - needs larger breakpoint for mobile (< 640px)

- ⚠️ Quick donate widget: `max-w-sm` (384px) - too wide for mobile < 320px screens
  - Consider: `max-w-sm md:max-w-md`

- ⚠️ Auth card: `max-w-md` (448px) - needs horizontal padding on mobile
  - Currently: `px-4` only, should be more on smaller screens

**Proposed Fixes:**
1. Sidebar responsive hiding:
   ```tsx
   // Admin shell - ensure sidebar hidden on mobile
   "fixed inset-y-0 right-0 z-20 hidden w-72 border-l lg:flex"
   "lg:me-72"  // Only apply margin on lg+ screens
   ```

2. Mobile-first max-widths:
   ```tsx
   "w-full max-w-xs sm:max-w-sm md:max-w-md"
   ```

3. Update hero section breakpoint:
   ```tsx
   "h-80 sm:h-96 lg:h-screen"  // More mobile-friendly
   ```

**Files to Update:**
- `components/admin/admin-shell.tsx`
- `components/home/hero-section.tsx`
- `components/home/quick-donate-widget.tsx`
- `components/auth/auth-card.tsx`

---

#### 1.4 Z-Index & Element Blocking Issues

**Issues Found:**
- ✅ Header: `z-50` (sticky top-0) - appears correct
- ✅ Admin sidebar: `z-20` - below header z-50, OK
- ⚠️ Sheet/Modal: Check z-index layering in sheet.tsx/dialog.tsx

**Proposed Check:**
- Verify modals render above all other elements
- Ensure no content is hidden behind sticky headers on mobile

**Files to Check:**
- `components/ui/sheet.tsx`
- `components/ui/dialog.tsx`
- Test on mobile viewport (375px width)

---

### Phase 1 Summary

| Category | Issues Found | Fixes Required |
|----------|-------------|----------------|
| RTL/LTR | 5 | Replace `ml-`, `mr-`, `pl-`, `pr-` with `ms-`, `me-`, `ps-`, `pe-` |
| Touch Targets | 4 | Update button/input heights for 44px minimum on mobile |
| Mobile Layout | 4 | Fix responsive breakpoints and max-widths |
| Z-Index | 2 | Verify modal stacking (low risk) |
| **TOTAL** | **15** | **All directly fixable** |

---

## PHASE 2: STRICT COMPONENT ARCHITECTURE REFACTORING

### Current State Analysis

```
❌ CURRENT (FLAT & MIXED):
components/
├── ui/                    ← UI components (GOOD)
├── auth/                  ← Contains LoginForm, RegisterForm (SMART - WRONG PLACE)
├── donate/                ← Contains DonationFlow, PaymentStep (SMART - WRONG PLACE)
├── profile/               ← Contains ProfileHeader, WalletCard (MIXED)
├── home/                  ← Contains QuickDonateWidget (SMART - WRONG PLACE)
├── admin/                 ← Admin components (SMART - WRONG PLACE)
├── about/                 ← Static components (UI - WRONG PLACE)
└── ...                    ← Others mixed
```

### Proposed Architecture

```
✅ TARGET STRUCTURE:
app/                      ← Pages (Next.js App Router)
├── (auth)/                ← Auth routes group
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── verify-otp/page.tsx
├── (main)/                ← Main routes group
│   ├── page.tsx          (home)
│   ├── projects/page.tsx
│   ├── donate/page.tsx
│   └── ...
└── admin/                 ← Admin routes

components/
├── ui/                    ← DUMB UI Components (No Business Logic)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── accordion.tsx
│   └── ... (all unstyled, reusable)
│
└── common/                ← DUMB Common Components (Layout, Navigation)
    ├── site-header.tsx
    ├── site-footer.tsx
    ├── social-icons.tsx
    └── locale-provider.tsx

lib/
├── api/                   ← API Services (NEW)
│   ├── client.ts          ← Axios instance with interceptors
│   ├── auth.ts            ← Auth API calls (login, register, verify-otp)
│   ├── donations.ts       ← Donation API calls
│   ├── projects.ts        ← Project API calls
│   └── profile.ts         ← Profile API calls
│
├── hooks/                 ← Custom Hooks (NEW/EXPANDED)
│   ├── use-auth.ts        ← Auth state & context
│   ├── use-donation.ts    ← Donation mutations
│   ├── use-locale.ts      ← Locale management
│   └── ...
│
└── utils.ts               ← Utilities

modules/
├── auth/
│   ├── components/
│   │   ├── login-form.tsx     ← SMART: handles API call
│   │   ├── register-form.tsx  ← SMART: handles API call
│   │   └── verify-otp-form.tsx ← SMART: handles API call + email param
│   │
│   └── hooks/
│       ├── use-login.ts
│       ├── use-register.ts
│       └── use-verify-otp.ts
│
├── donation/
│   ├── components/
│   │   ├── donation-flow.tsx      ← SMART: Form state + API
│   │   ├── donation-stepper.tsx   ← DUMB: Presentation
│   │   ├── amount-step.tsx        ← DUMB: Form UI
│   │   ├── payment-step.tsx       ← DUMB: Form UI
│   │   ├── confirmation-step.tsx  ← DUMB: Display
│   │   └── donation-summary-card.tsx ← DUMB: Display
│   │
│   └── hooks/
│       └── use-donation-flow.ts   ← Manages donation state & API calls
│
├── profile/
│   ├── components/
│   │   ├── profile-header.tsx        ← SMART: Fetch user data
│   │   ├── donation-history-list.tsx ← SMART: Fetch donations
│   │   ├── wallet-card.tsx           ← SMART: Fetch wallet info
│   │   └── ...
│   │
│   └── hooks/
│       └── use-profile.ts
│
├── admin/
│   ├── components/
│   │   ├── admin-shell.tsx    ← Layout
│   │   ├── content-manager.tsx
│   │   └── ...
│   │
│   └── hooks/
│       └── use-admin.ts
│
└── home/
    ├── components/
    │   ├── hero-section.tsx          ← DUMB: Display + local state
    │   ├── quick-donate-widget.tsx   ← DUMB: Local form state
    │   ├── featured-project-carousel.tsx ← SMART: Fetch featured projects
    │   └── ...
    │
    └── hooks/
        └── use-featured-projects.ts
```

### Refactoring Map (Phase 2)

#### Module: `auth`

| Current File | New Location | Changes |
|--------------|--------------|---------|
| `components/auth/auth-card.tsx` | `modules/auth/components/auth-card.tsx` | Keep (UI wrapper) |
| `components/auth/verify-otp-form.tsx` | `modules/auth/components/verify-otp-form.tsx` | **SMART**: Add email param, API call |
| `app/login/page.tsx` | `app/(auth)/login/page.tsx` | Import smart form from module |
| `app/register/page.tsx` | `app/(auth)/register/page.tsx` | Import smart form from module |
| `app/verify-otp/page.tsx` | `app/(auth)/verify-otp/page.tsx` | Import smart form from module |
| NEW | `modules/auth/hooks/use-login.ts` | Custom hook for login mutation |
| NEW | `modules/auth/hooks/use-register.ts` | Custom hook for register mutation |
| NEW | `modules/auth/hooks/use-verify-otp.ts` | Custom hook for OTP verification |

**Key Changes:**
- Extract login form logic from `app/login/page.tsx` → `modules/auth/components/login-form.tsx`
- Extract register form logic from `app/register/page.tsx` → `modules/auth/components/register-form.tsx`
- Update `verify-otp-form.tsx` to REQUIRE `email` prop and send both email + otp to backend

#### Module: `donation`

| Current File | New Location | Changes |
|--------------|--------------|---------|
| `components/donate/donation-flow.tsx` | `modules/donation/components/donation-flow.tsx` | **SMART**: State + API |
| `components/donate/amount-step.tsx` | `modules/donation/components/amount-step.tsx` | Keep (DUMB) |
| `components/donate/payment-step.tsx` | `modules/donation/components/payment-step.tsx` | Keep (DUMB) |
| `components/donate/confirmation-step.tsx` | `modules/donation/components/confirmation-step.tsx` | Keep (DUMB) |
| `components/donate/donation-stepper.tsx` | `modules/donation/components/donation-stepper.tsx` | Keep (DUMB) |
| `components/donate/donation-summary-card.tsx` | `modules/donation/components/donation-summary-card.tsx` | Keep (DUMB) |
| `components/donate/donor-details-section.tsx` | `modules/donation/components/donor-details-section.tsx` | Keep (DUMB) |
| `components/donate/step-heading.tsx` | `modules/donation/components/step-heading.tsx` | Keep (DUMB) |
| `components/donate/amount-step.tsx` | `modules/donation/components/amount-step.tsx` | Keep (DUMB) |
| NEW | `modules/donation/hooks/use-donation-flow.ts` | State management + API |
| NEW | `modules/donation/hooks/use-create-donation.ts` | Donation submission hook |

#### Module: `profile`

| Current File | New Location | Changes |
|--------------|--------------|---------|
| `components/profile/profile-header.tsx` | `modules/profile/components/profile-header.tsx` | **SMART**: Fetch user |
| `components/profile/wallet-card.tsx` | `modules/profile/components/wallet-card.tsx` | **SMART**: Fetch wallet |
| `components/profile/donation-history-list.tsx` | `modules/profile/components/donation-history-list.tsx` | **SMART**: Fetch history |
| `components/profile/monthly-donation-card.tsx` | `modules/profile/components/monthly-donation-card.tsx` | **SMART**: Fetch subscriptions |
| `components/profile/my-projects-grid.tsx` | `modules/profile/components/my-projects-grid.tsx` | **SMART**: Fetch user projects |
| `components/profile/security-card.tsx` | `modules/profile/components/security-card.tsx` | Update form handling |
| `components/profile/notifications-card.tsx` | `modules/profile/components/notifications-card.tsx` | Update form handling |
| NEW | `modules/profile/hooks/use-profile.ts` | Fetch user profile |
| NEW | `modules/profile/hooks/use-donations.ts` | Fetch donation history |
| NEW | `modules/profile/hooks/use-wallet.ts` | Fetch wallet data |

#### Module: `home`

| Current File | New Location | Changes |
|--------------|--------------|---------|
| `components/home/hero-section.tsx` | `modules/home/components/hero-section.tsx` | Keep (DUMB) |
| `components/home/quick-donate-widget.tsx` | `modules/home/components/quick-donate-widget.tsx` | Keep (DUMB, local state) |
| `components/home/featured-project-carousel.tsx` | `modules/home/components/featured-project-carousel.tsx` | **SMART**: Fetch featured |
| `components/home/life-saving-projects.tsx` | `modules/home/components/life-saving-projects.tsx` | **SMART**: Fetch projects |
| `components/home/category-strip.tsx` | `modules/home/components/category-strip.tsx` | Keep (DUMB) |
| `components/home/why-choose-us.tsx` | `modules/home/components/why-choose-us.tsx` | Keep (DUMB) |
| `components/home/donation-ways-card.tsx` | `modules/home/components/donation-ways-card.tsx` | Keep (DUMB) |
| `components/home/platform-rating-card.tsx` | `modules/home/components/platform-rating-card.tsx` | **SMART**: Fetch rating |
| `components/home/stats-band.tsx` | `modules/home/components/stats-band.tsx` | **SMART**: Fetch stats |
| NEW | `modules/home/hooks/use-featured-projects.ts` | Fetch featured projects |
| NEW | `modules/home/hooks/use-projects.ts` | Fetch all projects |

#### Module: `admin`

| Current File | New Location | Changes |
|--------------|--------------|---------|
| `components/admin/admin-shell.tsx` | `modules/admin/components/admin-shell.tsx` | Keep (Layout) |
| `app/admin/*` pages | `app/admin/*` pages | Wrap with AdminShell |
| NEW | `modules/admin/hooks/use-admin-auth.ts` | Check admin permissions |

#### Common Components (UI Layer - No Changes to Functionality)

Move these to `components/common/`:
- `site-header.tsx`
- `site-footer.tsx`
- `social-icons.tsx`
- `locale-provider.tsx`

Keep in `components/ui/`:
- All UI primitives (button, input, card, dialog, etc.)

### Import Path Updates Strategy

1. **Create lib/api/** folder with API clients
2. **Create modules/** folder structure
3. **Update all imports** in pages to use new paths:
   ```tsx
   // OLD
   import { LoginForm } from "@/components/auth/..."
   
   // NEW
   import { LoginForm } from "@/modules/auth/components/login-form"
   ```

4. **Update all re-exports** in package barrel files if needed

---

## PHASE 3: EXACT BACKEND INTEGRATION (WIRING)

### Current State: ZERO Backend Integration

- ❌ No API client setup (no axios/fetch configuration)
- ❌ All auth forms are mock/demo only
- ❌ No token handling (accessToken, refreshToken)
- ❌ OTP form doesn't send email
- ❌ No file upload handling
- ❌ Contact form simulates submission

### Required Implementation

#### 3.1 API Client Setup

**NEW FILE:** `lib/api/client.ts`

```typescript
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // ✅ Enable HttpOnly cookie for refreshToken
})

// ✅ Request Interceptor: Attach accessToken
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ Response Interceptor: Handle 401 token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh using httpOnly cookie
      try {
        const response = await axios.post(`${API_BASE}/auth/refresh`, {}, {
          withCredentials: true,
        })
        const newToken = response.data.accessToken
        localStorage.setItem('accessToken', newToken)
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${newToken}`
        return apiClient(error.config)
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

**Dependencies to Add:** `axios`

#### 3.2 Auth API Service

**NEW FILE:** `lib/api/auth.ts`

```typescript
import { apiClient } from './client'

export const authAPI = {
  login: (phone: string, password: string) =>
    apiClient.post('/auth/login', { phone, password }),
  
  register: (name: string, phone: string, password: string) =>
    apiClient.post('/auth/register', { name, phone, password }),
  
  verifyOtp: (email: string, otp: string) =>  // ✅ Takes both email & otp
    apiClient.post('/auth/verify-otp', { email, otp }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refreshToken: () =>
    apiClient.post('/auth/refresh', {}, { withCredentials: true }),
}
```

#### 3.3 Auth Hooks (React)

**NEW FILE:** `modules/auth/hooks/use-login.ts`

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api/auth'

export function useLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (phone: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authAPI.login(phone, password)
      // ✅ Store accessToken from response
      localStorage.setItem('accessToken', data.accessToken)
      // refreshToken comes via HttpOnly cookie automatically
      router.push('/profile')
      return data
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
```

**Similar hooks needed:**
- `use-register.ts`
- `use-verify-otp.ts`

#### 3.4 OTP Form Fix (Phase 3 Critical)

**CURRENT ISSUE:**
```tsx
// ❌ BEFORE: Only sends OTP
export function VerifyOtpForm() {
  const phone = searchParams.get("phone")
  // ...sends only: { code: "1234" }
}
```

**REQUIRED FIX:**
```tsx
// ✅ AFTER: Requires email, sends both
interface VerifyOtpFormProps {
  email: string  // ← NEW: Required prop
}

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  // ...
  const handleSubmit = async () => {
    // ✅ Send both email + otp
    await authAPI.verifyOtp(email, code)
  }
}

// In app/(auth)/verify-otp/page.tsx:
export default function VerifyOtpPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") // ← NEW: from query
  
  return <VerifyOtpForm email={email || ""} />
}
```

#### 3.5 File Upload Handling (If Needed)

**NEW FILE:** `lib/api/file-upload.ts`

```typescript
import { apiClient } from './client'

export const uploadAPI = {
  uploadImage: (file: File, key = 'image') => {
    const formData = new FormData()
    formData.append(key, file)  // ✅ Append to correct key
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
```

**Form Usage:**
```tsx
<form encType="multipart/form-data" onSubmit={handleSubmit}>
  <input type="file" name="image" required />
  {/* ✅ Standard form data, no manual FormData */}
</form>
```

#### 3.6 API Integration Checklist

| Endpoint | Frontend Form | Status | Notes |
|----------|---------------|--------|-------|
| `POST /auth/login` | Login form | ⚠️ TODO | Add to `login-form.tsx` |
| `POST /auth/register` | Register form | ⚠️ TODO | Add to `register-form.tsx` |
| `POST /auth/verify-otp` | OTP form | ⚠️ TODO | **MUST send email + otp** |
| `POST /auth/logout` | Logout button | ⚠️ TODO | Add to profile/header |
| `POST /auth/refresh` | Interceptor | ⚠️ TODO | Already in client.ts |
| `POST /donations` | Donation flow | ⚠️ TODO | Add to donation-flow |
| `GET /profile` | Profile page | ⚠️ TODO | Add to profile hooks |
| `GET /donations/history` | History list | ⚠️ TODO | Add to use-donations |
| `GET /projects` | Projects page | ⚠️ TODO | Add to use-projects |
| `POST /contact` | Contact form | ⚠️ TODO | Replace mock submit |
| `POST /upload` | File uploads | ⚠️ TODO | If admin needs images |
| `GET /wallet` | Wallet card | ⚠️ TODO | Add to use-wallet |

---

## EXECUTION ROADMAP

### Phase 1: UI/Mobile/RTL Fixes (2-3 hours)
1. Replace directional CSS classes (ml-, mr-, pl-, pr-)
2. Update button/input touch target sizes
3. Fix mobile responsive breakpoints
4. Test on mobile viewport (375px, 425px)

**Deliverable:** All components pass mobile accessibility audit

### Phase 2: Component Architecture (4-5 hours)
1. Create `modules/` folder structure
2. Move and refactor components
3. Update all imports
4. Create new hooks in `lib/hooks/`

**Deliverable:** Clean separation between Dumb UI and Smart Feature components

### Phase 3: Backend Integration (6-8 hours)
1. Set up `lib/api/` with axios + interceptors
2. Create API service functions
3. Convert form components to use API
4. Implement token refresh flow
5. Update OTP form to require email
6. Test all endpoints with backend

**Deliverable:** Full backend connectivity with proper auth flow

**Total Estimated Time:** 12-16 hours

---

## APPROVAL CHECKLIST

Before proceeding to code changes, please confirm:

- [ ] RTL/LTR fixes look correct?
- [ ] Mobile breakpoint changes acceptable?
- [ ] Component reorganization structure approved?
- [ ] API integration approach (axios + interceptors) approved?
- [ ] Token storage strategy (localStorage + httpOnly cookie) approved?
- [ ] OTP email requirement approved?
- [ ] Ready to execute all three phases?

---

## NOTES & RISKS

### High Priority
1. **OTP Flow:** Must collect email parameter - affects auth flow
2. **Token Handling:** Properly separate accessToken (Bearer) from refreshToken (httpOnly)
3. **RTL:** Directional CSS changes must be tested in Arabic interface

### Medium Priority
1. **Touch Targets:** Mobile testing essential before deployment
2. **Import Refactoring:** High risk of breaking imports - need systematic approach
3. **API Mocking:** May need to keep mock-data for development/testing

### Low Priority
1. **File Uploads:** Only if admin panel needs it
2. **TypeScript:** Ensure all new API responses are properly typed

---

**READY FOR PHASE 1 EXECUTION: YES/NO?**

*Once approved, I will execute all changes systematically.*
