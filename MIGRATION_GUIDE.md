# User Details API Optimization - Migration Guide

## Problem

Multiple components are making repeated calls to `https://api2.caregiverhospital.com/app_user/get-user-detail/{userId}/` causing unnecessary network requests.

## Solution Options

### Option 1: React Context (Recommended) ✅

We've implemented a `UserContext` that fetches user details once and provides them to all components.

**Files Created:**

- `/contexts/UserContext.tsx` - React context provider
- `/lib/userCache.ts` - localStorage caching utility

**Files Modified:**

- `/app/layout.tsx` - Added UserProvider wrapper

**Benefits:**

- Single API call per session
- Automatic error handling
- Loading states managed globally
- Easy to use with `useUser()` hook

### Option 2: Simple localStorage Caching

Use the caching utility in individual components.

## How to Migrate Components

### Step 1: Import the hook

```tsx
import { useUser } from "contexts/UserContext"
```

### Step 2: Replace local state

```tsx
// Before
const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// After
const { userDetails, loading, error } = useUser()
```

### Step 3: Remove fetchUserDetails function

Delete the entire `fetchUserDetails` function and its useEffect call.

### Step 4: Update useEffect

```tsx
// Before
useEffect(() => {
  fetchUserDetails()
  fetchOtherData()
}, [])

// After
useEffect(() => {
  fetchOtherData()
}, [])
```

## Components to Update

### Priority 1: Modal Components

- ✅ `/components/Modals/CheckoutPatientModal.tsx` - DONE
- `/components/Modals/PrescriptionModal.tsx`
- `/components/Modals/AdministerDrugModal.tsx`
- `/components/Modals/LabTestModal.tsx`
- `/components/Modals/PrescribeMedicationModal.tsx`

### Priority 2: Navbar Components

- `/components/Navbar/DoctorNav.tsx` - PARTIALLY DONE
- `/components/Navbar/DashboardNav.tsx`
- `/components/Navbar/CashierNav.tsx`
- `/components/Navbar/NursesNav.tsx`
- `/components/Navbar/LaboratoryNav.tsx`
- `/components/Navbar/PharmacyNav.tsx`

## Quick Migration Script

For each component, replace this pattern:

```tsx
// REMOVE THIS
const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  fetchUserDetails()
}, [])

const fetchUserDetails = async () => {
  // ... entire function
}
```

With this:

```tsx
// ADD THIS
import { useUser } from "contexts/UserContext"

// REPLACE STATE WITH:
const { userDetails, loading, error } = useUser()
```

## Testing

After migration:

1. Open browser dev tools Network tab
2. Login to the application
3. Open modals and navigate between pages
4. Verify only ONE call to `get-user-detail` is made

## Benefits Achieved

- **Performance**: Reduced from 11+ API calls to 1 per session
- **User Experience**: Faster loading, less network latency
- **Code Maintainability**: Centralized user state management
- **Error Handling**: Consistent error handling across app
- **Type Safety**: Proper TypeScript interfaces

## Next Steps

1. Apply migration to remaining components
2. Consider adding user data refresh logic if needed
3. Add unit tests for UserContext
4. Monitor API usage in production
