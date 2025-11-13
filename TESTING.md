# Testing Documentation

## Test Cases for Secure Web Application

### 1. User Signup - Valid Input
**Steps:**
1. Navigate to `/signup`
2. Enter username: `testuser123`
3. Enter email: `test@example.com`
4. Enter password: `SecurePass123!`
5. Confirm password: `SecurePass123!`
6. Click "Create Account"

**Expected:** Account created, redirected to login  
**Result:** ✅ Pass

### 2. User Signup - Weak Password
**Steps:**
1. Navigate to `/signup`
2. Enter username: `testuser`
3. Enter email: `test@example.com`
4. Enter password: `weak`
5. Click "Create Account"

**Expected:** Error messages for password requirements  
**Result:** ✅ Pass

### 3. User Login - Valid Credentials
**Steps:**
1. Navigate to `/login`
2. Enter registered email
3. Enter correct password
4. Click "Sign In"

**Expected:** Login successful, redirect to dashboard  
**Result:** ✅ Pass

### 4. SQL Injection Attempt
**Steps:**
1. Navigate to `/login`
2. Enter email: `admin' OR '1'='1`
3. Enter password: `anything`
4. Click "Sign In"

**Expected:** Login fails, no SQL error  
**Result:** ✅ Pass - Input validated, treated as literal string

### 5. XSS Attempt - Script in Username
**Steps:**
1. Navigate to `/signup`
2. Enter username: `<script>alert('xss')</script>`
3. Submit form

**Expected:** Validation error (invalid characters)  
**Result:** ✅ Pass - Regex validation prevents special chars

### 6. Rate Limiting Test
**Steps:**
1. Navigate to `/login`
2. Enter incorrect credentials 5 times
3. Observe lockout

**Expected:** Account locked for 15 minutes after 5 attempts  
**Result:** ✅ Pass

### 7. Protected Route Access
**Steps:**
1. Open browser (not logged in)
2. Navigate to `/dashboard`

**Expected:** Redirect to `/login`  
**Result:** ✅ Pass

### 8. Session Persistence
**Steps:**
1. Login successfully
2. Refresh page
3. Check if still authenticated

**Expected:** User remains logged in  
**Result:** ✅ Pass

### 9. Password Strength Indicator
**Steps:**
1. Navigate to `/signup`
2. Type password progressively: `a`, `aA`, `aA1`, `aA1!`
3. Observe strength meter

**Expected:** Meter increases from weak to strong  
**Result:** ✅ Pass

### 10. Logout Functionality
**Steps:**
1. Login to dashboard
2. Click "Logout" button
3. Verify redirect and session cleared

**Expected:** Redirect to home, cannot access dashboard  
**Result:** ✅ Pass

### Curl Test Examples

**Test CSRF (missing token):**
```bash
curl -X POST http://localhost:8080/api/protected \
  -H "Content-Type: application/json" \
  -d '{"action":"delete"}'
# Expected: 403 Forbidden (CSRF protection active)
```

**Test SQL Injection:**
```bash
# Attempt via API (if exposed)
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin'"'"' OR '"'"'1'"'"'='"'"'1","password":"test"}'
# Expected: 400 Bad Request (validation failure)
```

## Database Verification

**Check password hashing:**
```sql
-- Via backend interface
SELECT id, email, created_at FROM auth.users LIMIT 5;
-- Note: password_hash field exists but is never exposed via API

SELECT user_id, username, email FROM profiles LIMIT 5;
-- Verify: No password field in profiles table
```

**Verify RLS policies:**
```sql
-- Try to access another user's data (should fail)
SELECT * FROM profiles WHERE user_id != auth.uid();
-- Expected: No rows returned (RLS enforced)
```

## Security Checklist

- [x] Passwords hashed with bcrypt
- [x] SQL injection prevented (parameterized queries)
- [x] XSS prevented (React escaping + validation)
- [x] CSRF protection enabled
- [x] httpOnly cookies used
- [x] Rate limiting implemented
- [x] Input validation on all forms
- [x] RLS policies active on all tables
- [x] Session management secure
- [x] Protected routes enforced
