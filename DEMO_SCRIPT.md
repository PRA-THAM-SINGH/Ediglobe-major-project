# Demo Script & Viva Questions

## Demo Flow (15-20 minutes)

### 1. Introduction (2 min)
"This is a secure web application demonstrating modern security practices including password hashing, SQL injection protection, XSS prevention, CSRF protection, and secure session management."

### 2. Landing Page Demo (1 min)
- Show homepage with security features listed
- Explain the security-focused design

### 3. Signup Demo (3 min)
- Click "Sign Up"
- Show password strength indicator
- Attempt weak password → Show validation errors
- Enter strong credentials
- **Point out:** "Password is validated client-side AND will be hashed server-side with bcrypt"

### 4. Login Demo (3 min)
- Navigate to Login
- Show rate limiting: "After 5 failed attempts, account locks for 15 minutes"
- Login with correct credentials
- Redirect to dashboard

### 5. Dashboard Demo (2 min)
- Show user profile information
- Point out: "This data is protected by Row Level Security - users can only see their own data"
- Show security features badge

### 6. Security Feature Explanations (5 min)

**Show Database (Backend):**
- Open backend interface
- Show `profiles` table structure
- **Important:** "Notice there's no password field here - passwords are stored separately and automatically hashed"
- Show RLS policies

**Show Code:**
```typescript
// Parameterized query (SQL injection prevention)
await supabase.from('profiles').select('*').eq('user_id', userId)

// Validation schema (input sanitization)
usernameSchema = z.string().regex(/^[a-zA-Z0-9_]+$/)
```

### 7. Attack Demonstrations (4 min)

**SQL Injection Attempt:**
1. Try to login with: `admin' OR '1'='1`
2. Show it fails: "Input validation rejects this, and even if it passed, parameterized queries prevent injection"

**XSS Attempt:**
1. Try username: `<script>alert('xss')</script>`
2. Show validation error: "Regex validation prevents special characters"

**Rate Limiting:**
1. Show failed login tracking
2. "After 5 attempts, account locks automatically"

## Viva Questions & Answers

### Q1: What is bcrypt and why use it for password hashing?
**Answer:** bcrypt is an adaptive password hashing function that uses the Blowfish cipher. Unlike MD5 or SHA, bcrypt is intentionally slow (configurable via cost factor), making brute-force attacks computationally expensive. It automatically handles salt generation, preventing rainbow table attacks. Each password gets a unique salt, and the cost can be increased over time as hardware improves.

### Q2: How does this application prevent SQL injection attacks?
**Answer:** The application uses parameterized queries through the Supabase client library. User inputs are never concatenated into SQL strings. Instead, they're passed as parameters that are automatically escaped and sanitized. The database treats them as data, not executable code. Additionally, input validation with Zod schemas provides an extra layer of protection.

### Q3: Explain XSS and how you've prevented it.
**Answer:** Cross-Site Scripting (XSS) occurs when attackers inject malicious scripts into web pages. We prevent it through: (1) React's automatic JSX escaping - all rendered content is escaped by default, (2) Strict input validation using regex patterns that reject special characters, (3) No use of dangerouslySetInnerHTML, (4) Content Security Policy headers (future enhancement).

### Q4: What is CSRF and how is it mitigated here?
**Answer:** CSRF (Cross-Site Request Forgery) tricks authenticated users into performing unwanted actions. We mitigate this through: (1) Token-based CSRF protection built into Supabase Auth, (2) SameSite cookie attribute preventing cross-site submissions, (3) CORS headers restricting API access. The authentication tokens include CSRF tokens that must match on each request.

### Q5: What is Row Level Security (RLS)?
**Answer:** RLS is a PostgreSQL feature providing database-level access control. Policies define which rows users can access based on their authentication. Even if application code is compromised, the database enforces these rules. In our app, policies ensure users can only view/modify their own profile data using `auth.uid() = user_id` conditions.

### Q6: How does session management work securely?
**Answer:** Sessions are managed with httpOnly cookies that JavaScript cannot access (XSS protection). The SameSite attribute prevents CSRF. Tokens automatically refresh before expiration. Sessions are stored securely and invalidated on logout. In production, the Secure flag ensures cookies only transmit over HTTPS.

### Q7: Why validate input on both client and server side?
**Answer:** Client-side validation provides immediate user feedback and reduces server load. However, it can be bypassed by attackers. Server-side validation (RLS policies, database constraints) is the security enforcement layer that cannot be bypassed. Defense in depth principle - multiple layers of protection.

### Q8: What is the purpose of rate limiting?
**Answer:** Rate limiting prevents brute-force attacks where attackers try many password combinations. Our implementation allows 5 login attempts per 15 minutes. After exceeding this, the account temporarily locks. This makes automated password cracking infeasible while minimizing impact on legitimate users.

### Q9: How would you implement HTTPS in production?
**Answer:** HTTPS encrypts data in transit, preventing man-in-the-middle attacks. Implementation: (1) Obtain SSL/TLS certificate from Let's Encrypt or certificate authority, (2) Configure web server (Nginx/Apache) to use certificate, (3) Redirect all HTTP to HTTPS, (4) Enable HSTS header forcing HTTPS, (5) Set Secure flag on cookies. Lovable provides HTTPS automatically on deployment.

### Q10: What improvements would you make for production?
**Answer:** (1) Enable email verification, (2) Implement two-factor authentication, (3) Server-side rate limiting with Redis, (4) Comprehensive audit logging with IP tracking, (5) Security headers (CSP, HSTS), (6) Automated security scanning, (7) Password history to prevent reuse, (8) CAPTCHA on login/signup, (9) Session management UI, (10) Regular security audits and penetration testing.

## Technical Questions

### Q11: Explain the authentication flow step-by-step.
**Answer:** (1) User submits credentials, (2) Frontend validates with Zod, (3) Request sent to Supabase Auth, (4) Password compared against bcrypt hash, (5) If valid, JWT tokens generated, (6) Tokens stored in httpOnly cookies, (7) Frontend receives session object, (8) Session checked on each protected route, (9) Tokens auto-refresh before expiry.

### Q12: What is the difference between authentication and authorization?
**Answer:** Authentication verifies identity ("who are you?") - confirming users are who they claim to be through credentials. Authorization determines permissions ("what can you do?") - defining what resources authenticated users can access. Our app uses authentication (login) and authorization (RLS policies controlling data access).
