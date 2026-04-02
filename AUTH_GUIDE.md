# Frontend Authentication System - Complete Guide

## 🔐 How Password Reset Works

### Flow Overview

1. **User Forgot Password** → Clicks "Forgot Password" link
2. **Enter Email** → User enters their email address at `/forgot-password`
3. **Backend Generates Token** → Server creates a unique reset token and:
   - Stores it in the database (`resetPasswordToken` field)
   - Sets an expiration time (1 hour from now in `resetPasswordExpires`)
   - Stores in the User document
4. **Email Sent** → Nodemailer sends an email with a reset link:
   - Link format: `http://yoursite.com/reset-password?token=<token>`
   - The token is the unique identifier
5. **User Clicks Email Link** → Takes them to `/reset-password?token=<token>`
6. **Enter New Password** → User enters new password (with confirmation)
7. **Backend Validates** → Server checks:
   - Token matches one in database
   - Token hasn't expired (still < 1 hour old)
   - Passwords match and meet length requirement
8. **Password Hashed & Saved** → New password bcrypt-hashed and stored
   - `resetPasswordToken` and `resetPasswordExpires` are cleared
9. **Redirect to Login** → User can now login with new password

---

## 🔑 Login Flow

1. **User enters email + password** at `/login`
2. **API validates credentials**:
   - Finds user by email
   - Compares password with bcrypt-hashed version
   - Returns error if invalid
3. **JWT token created** with user ID and name (expires in 7 days)
4. **Token stored** in browser (localStorage via Zustand persist)
5. **Cookie set** with token (httpOnly for security)
6. **User redirected** to home, now authenticated
7. **All page requests** include token in Authorization header or cookie

---

## 📝 Signup Flow

1. **User enters**: Email, Display Name (optional), Password
2. **Validation**:
   - Email must be unique and required
   - Password minimum 6 characters
   - If no name provided, uses email prefix (e.g., "user@example.com" → "user")
3. **Password hashed** with bcrypt (salt rounds: 10)
4. **User created** in MongoDB
5. **JWT token issued** automatically
6. **Logged in immediately** after signup

---

## 👤 User State Management (Zustand Store)

The auth store (`authStore.tsx`) manages:

- `user` - Current user object `{ id, name, email }`
- `token` - JWT token string
- `isAuthenticated` - Boolean flag
- `isLoading` - Loading state during API calls
- `error` - Error message from failed requests

**Persisted Storage**: User and token automatically saved to localStorage and restored on page reload.

---

## 🎨 UI Components

### `/login`

- Email + Password inputs
- Show/hide password toggle
- Success message on login
- Links to Forgot Password and Signup

### `/signup`

- Name (optional) + Email + Password inputs
- Password confirmation with validation
- Success message on signup
- Link to Login

### `/forgot-password`

- Email input
- Sends reset email
- Shows success message "Check your email"

### `/reset-password?token=<token>`

- New password + confirm password
- Only works if token is valid and not expired
- Validates token exists in URL

---

## 🔌 API Integration

All auth API calls are in `src/api/authAPI.ts`:

- `signup(name, email, password)` → returns user + token
- `login(email, password)` → returns user + token
- `logout()` → clears cookie
- `requestPasswordReset(email)` → sends reset email
- `resetPassword(token, password)` → validates + updates password
- `deleteUser(token)` → deletes account

**Base URL**: Uses `VITE_API_URL` environment variable (defaults to `http://localhost:5000/api`)

---

## 🛡️ Security Features

1. **Passwords hashed** with bcrypt (10 salt rounds)
2. **JWT tokens** expire in 7 days
3. **Reset tokens** expire in 1 hour
4. **Email required** for password reset (ensures user owns account)
5. **HTTP-only cookies** prevent XSS access to tokens
6. **Token stored in localStorage** (via Zustand persist) for page reload
7. **CORS credentials** enabled for cross-domain requests

---

## 📌 Making Pages Editable When Logged In

Use the `EditablePageWrapper` component:

```tsx
import { EditablePageWrapper } from "../components/EditablePageWrapper";

export function MyPage() {
  return (
    <EditablePageWrapper pageName="myPage" onSave={handleSave}>
      <div>Page content here...</div>
    </EditablePageWrapper>
  );
}
```

When a user is logged in:

- "Edit Page" button appears
- Click to enter edit mode
- Textarea shows for editing
- Save/Cancel buttons appear
- Content saved to backend on Save

When logged out:

- Edit button hidden
- Page displays normally
- No editable features

---

## 🚀 Environment Setup

Create `.env.local` in `/client`:

```
VITE_API_URL=http://localhost:5000/api
```

For production (e.g., Render):

```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📊 Database Structure

### User Document

```
{
  _id: ObjectId,
  name: String,
  email: String (unique, required),
  password: String (bcrypt hashed),
  resetPasswordToken: String (optional),
  resetPasswordExpires: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### PageData Document

```
{
  _id: ObjectId,
  page: String (enum: about, art, booking, contact, homepage, tattoos),
  data: Mixed (JSON object with page content),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Example Login Sequence

1. User at `/login`
2. Enters `user@example.com` + `password123`
3. Frontend calls `POST /api/auth/login`
4. Backend finds user by email, compares password
5. If valid: Returns `{ id, name, email, token }`
6. Frontend stores in Zustand (auto-persists to localStorage)
7. Header shows "Welcome, [name]" + Logout button
8. Pages can use `useAuthStore()` to access user
9. Protected routes can redirect if not authenticated

---

## 🔄 Token Refresh

Currently tokens last 7 days. To add refresh token logic later, you can:

1. Issue a short-lived access token (15 min)
2. Issue a long-lived refresh token (7 days) in a separate httpOnly cookie
3. When access token expires, use refresh token to get new one
4. This is more secure for production apps

---

## 🆘 Troubleshooting

- **"Invalid credentials"** → Email not registered or password wrong
- **"Reset link expired"** → Token > 1 hour old, request new one
- **"Email not found"** → No account with that email
- **CORS error** → Check `VITE_API_URL` and backend CORS settings
- **Token not persisting** → Check browser localStorage is enabled

---
