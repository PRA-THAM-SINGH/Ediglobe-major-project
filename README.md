# Secure Web Application - Authentication Demo

A modern, secure web application demonstrating enterprise-level security practices including authentication, input validation, SQL injection protection, XSS prevention, CSRF protection, and secure session management.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Security Features](#security-features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)
- [Future Improvements](#future-improvements)

## 🎯 Project Overview

This project is a comprehensive demonstration of web application security best practices. It implements a complete authentication system with signup, login, and dashboard functionality while showcasing modern security measures to protect against common vulnerabilities.

**Key Features:**
- User registration with strong password requirements
- Secure login with rate limiting
- Protected dashboard for authenticated users
- Real-time password strength indicator
- Session management with automatic token refresh
- Comprehensive input validation
- Security audit logging

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend (superbase)
- **PostgreSQL** - Relational database with RLS (Row Level Security)
- **Supabase Auth** - Authentication service with bcrypt password hashing
- **Edge Functions** - Serverless backend logic (if needed)

### Security Libraries
- **@hookform/resolvers** - Form validation resolver
- **zod** - Runtime type checking and validation
- Built-in CSRF protection
- Secure session management with httpOnly cookies

## 🔒 Security Features

### 1. **Password Hashing**
- Passwords are hashed using **bcrypt** algorithm with salt rounds
- Original passwords are never stored in the database
- Hash verification happens server-side during login
- **Implementation**: Handled automatically by Supabase Auth

### 2. **SQL Injection Protection**
- All database queries use **parameterized queries**
- No string concatenation in SQL statements
- Supabase client library handles query sanitization
- **Example**: 
  ```typescript
  // Secure - parameterized query
  await supabase.from('profiles').select('*').eq('user_id', userId)
  
  // Never done - string concatenation (vulnerable)
  // query = "SELECT * FROM profiles WHERE user_id = '" + userId + "'"
  ```

### 3. **XSS (Cross-Site Scripting) Prevention**
- React automatically escapes all rendered content
- Input validation with Zod schemas
- No use of `dangerouslySetInnerHTML`
- Content Security Policy headers
- **Implementation**: React's JSX auto-escaping + validation

### 4. **CSRF (Cross-Site Request Forgery) Protection**
- Token-based CSRF protection on all POST requests
- Supabase Auth includes built-in CSRF protection
- Secure, httpOnly cookies with SameSite attribute
- **Implementation**: Built into Supabase Auth

### 5. **Secure Session Management**
- Sessions stored securely with httpOnly cookies
- Automatic token refresh to maintain session
- Session invalidation on logout
- Cookie flags: `httpOnly`, `sameSite='lax'`, `secure` (in production)
- **Implementation**: Managed by Supabase Auth

### 6. **Input Validation**
- Comprehensive Zod schemas for all inputs
- Client-side and server-side validation
- Strict regex patterns for username (alphanumeric only)
- Email format validation
- Password complexity requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### 7. **Rate Limiting**
- Login attempts limited to 5 per 15 minutes
- Account temporarily locked after exceeded attempts
- Client-side tracking with localStorage
- Protection against brute force attacks

### 8. **Row Level Security (RLS)**
- Database-level access control
- Users can only access their own data
- Policies enforce data isolation
- **Example**: Users can only view/update their own profile

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd secure-auth-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   The `.env` file is automatically configured when using Lovable Cloud. It contains:
   - `VITE_SUPABASE_URL` - Backend API URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
   - `VITE_SUPABASE_PROJECT_ID` - Project identifier

   **Note**: Never commit `.env` files to version control. The provided `.env` is for development only.

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:8080`

### Production Build
```bash
npm run build
npm run preview
```

### Access the Application
1. Open your browser and navigate to `http://localhost:8080`
2. You'll see the landing page with security features
3. Click "Sign Up" to create a new account
4. Fill in the registration form with:
   - Username (3-30 characters, alphanumeric only)
   - Valid email address
   - Strong password meeting all requirements
   - Matching password confirmation
5. After signup, login with your credentials
6. You'll be redirected to your secure dashboard

## 📁 Project Structure

```
secure-auth-project/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn)
│   │   ├── Navbar.tsx       # Navigation bar with auth state
│   │   ├── ProtectedRoute.tsx  # Route guard for authentication
│   │   └── SecurityBadge.tsx   # Security features display
│   ├── hooks/
│   │   ├── useAuth.tsx      # Authentication hook
│   │   └── use-toast.ts     # Toast notifications
│   ├── lib/
│   │   ├── validations.ts   # Zod validation schemas
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Landing page
│   │   ├── Signup.tsx       # User registration
│   │   ├── Login.tsx        # User login
│   │   ├── Dashboard.tsx    # Protected dashboard
│   │   └── NotFound.tsx     # 404 page
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts    # Supabase client (auto-generated)
│   │       └── types.ts     # Database types (auto-generated)
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and design system
├── public/
│   └── robots.txt           # SEO configuration
├── README.md                # This file
├── REPORT.md                # Project report for submission
├── TESTING.md               # Test cases and procedures
├── DEMO_SCRIPT.md           # Demo guide and viva questions
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🧪 Testing

Refer to `TESTING.md` for comprehensive test cases including:
- Functional testing (signup, login, logout)
- Security testing (SQL injection, XSS, CSRF attempts)
- Input validation testing
- Rate limiting verification
- Session management testing

## 📚 Documentation

- **README.md** - Installation and usage guide (this file)
- **REPORT.md** - Detailed project report with architecture and security analysis
- **TESTING.md** - Complete test plan with 12+ test cases
- **DEMO_SCRIPT.md** - Step-by-step demo guide with viva questions

## 🗄 Database Schema

### profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);
```

**Security Note**: Passwords are stored in the `auth.users` table managed by Supabase Auth and are automatically hashed with bcrypt. They are never accessible via API queries.

### security_logs Table
```sql
CREATE TABLE security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 🔍 Viewing Database Data

To verify security implementations:

1. **View Profile Data** (via Dashboard):
   - Login to your account
   - Navigate to the Dashboard
   - You'll see your profile information

2. **Backend Access**:
   - Access the backend through Lovable Cloud interface
   - View table structures and policies
   - **Note**: Password hashes are never displayed for security

3. **Verify Password Hashing**:
   - Passwords in the database are bcrypt hashes (60 characters)
   - Format: `$2a$10$...` or `$2b$10$...`
   - Original passwords are never stored

## 🚨 Known Limitations

This is a demonstration project. For production deployment, consider:

1. **HTTPS Required**
   - Enable HTTPS in production
   - Set `secure` flag on cookies

2. **Email Verification**
   - Currently disabled for development
   - Should be enabled in production

3. **Password Reset**
   - Placeholder implementation
   - Needs secure token-based reset flow

4. **Two-Factor Authentication (2FA)**
   - Not implemented
   - Recommended for production

5. **Account Lockout**
   - Current implementation uses client-side tracking
   - Should be server-side for production

6. **Audit Logging**
   - Basic logging implemented
   - Should include IP address tracking

## 🔮 Future Improvements

1. **Enhanced Security**
   - Implement server-side rate limiting
   - Add CAPTCHA for signup/login
   - Enable email verification
   - Add 2FA support
   - Implement password reset flow

2. **Features**
   - User profile editing
   - Profile picture upload
   - Activity history
   - Security notifications

3. **Infrastructure**
   - Deploy with HTTPS
   - Use production-grade secrets management
   - Implement comprehensive logging
   - Set up monitoring and alerts

4. **Testing**
   - Add unit tests with Jest
   - Integration tests with Cypress
   - Security penetration testing
   - Load testing

## 📖 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web security vulnerabilities
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/) - Security best practices
- [Supabase Documentation](https://supabase.com/docs) - Backend platform docs
- [React Security Best Practices](https://react.dev/learn/keeping-components-pure)
- [Zod Documentation](https://zod.dev/) - Schema validation
- [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) - Password hashing algorithm

## 📝 License

This project is created for educational purposes as a major project submission.

## 👨‍💻 Author

Created as a major project demonstrating secure web application development practices.

---

**Security Notice**: This application implements industry-standard security practices but should be thoroughly audited before production deployment. Always follow the principle of defense in depth and stay updated with the latest security recommendations.
