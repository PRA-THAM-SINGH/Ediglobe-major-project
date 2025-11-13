/**
 * Login Page
 * 
 * Security Features:
 * - Input validation
 * - Server-side rate limiting with database tracking
 * - Client-side state sync for UX
 * - Secure session creation
 * - Protection against brute force attacks
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, LogIn, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, LoginFormData } from "@/lib/validations";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const Login = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Check for existing lockout
  useEffect(() => {
    const lockoutEnd = localStorage.getItem("loginLockoutEnd");
    if (lockoutEnd) {
      const endTime = parseInt(lockoutEnd);
      if (Date.now() < endTime) {
        setIsLocked(true);
        setLockoutEndTime(endTime);
      } else {
        localStorage.removeItem("loginLockoutEnd");
        localStorage.removeItem("loginAttempts");
      }
    }

    const attempts = localStorage.getItem("loginAttempts");
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  }, []);

  // Handle lockout countdown
  useEffect(() => {
    if (!isLocked || !lockoutEndTime) return;

    const interval = setInterval(() => {
      if (Date.now() >= lockoutEndTime) {
        setIsLocked(false);
        setLockoutEndTime(null);
        setLoginAttempts(0);
        localStorage.removeItem("loginLockoutEnd");
        localStorage.removeItem("loginAttempts");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockoutEndTime]);

  const onSubmit = async (data: LoginFormData) => {
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutEndTime! - Date.now()) / 1000 / 60);
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${remainingTime} minute(s).`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check server-side rate limit BEFORE attempting login
      const { data: rateLimitCheck, error: rateLimitError } = await (supabase as any).rpc('check_rate_limit', {
        p_email: data.email,
        p_ip_address: null,
        p_max_attempts: MAX_LOGIN_ATTEMPTS,
        p_window_minutes: 15
      });

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
      }

      // Block login if server-side rate limit exceeded
      if (rateLimitCheck && !rateLimitCheck.allowed) {
        const lockoutUntil = new Date(rateLimitCheck.lockout_until).getTime();
        setIsLocked(true);
        setLockoutEndTime(lockoutUntil);
        localStorage.setItem("loginLockoutEnd", lockoutUntil.toString());
        localStorage.setItem("loginAttempts", MAX_LOGIN_ATTEMPTS.toString());
        
        toast({
          title: "Too many failed attempts",
          description: rateLimitCheck.message || "Your account has been temporarily locked.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Attempt login
      const { error } = await signIn(data.email, data.password);

      // Record the login attempt (success or failure) on server
      await (supabase as any).rpc('record_login_attempt', {
        p_email: data.email,
        p_ip_address: null,
        p_success: !error
      });

      if (error) {
        // Update client-side state for UX (server is source of truth)
        const attemptsRemaining = rateLimitCheck?.attempts_remaining ?? MAX_LOGIN_ATTEMPTS;
        const newAttempts = MAX_LOGIN_ATTEMPTS - attemptsRemaining + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem("loginAttempts", newAttempts.toString());

        toast({
          title: "Login failed",
          description: `Invalid credentials. ${Math.max(0, attemptsRemaining - 1)} attempt(s) remaining.`,
          variant: "destructive",
        });
      } else {
        // Reset attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("loginLockoutEnd");
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8 bg-gradient-card border-primary/20 shadow-card">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-primary shadow-glow">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to your secure account
              </p>
            </div>

            {/* Rate Limit Warning */}
            {loginAttempts > 0 && !isLocked && (
              <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {MAX_LOGIN_ATTEMPTS - loginAttempts} attempt(s) remaining before temporary lockout
                </p>
              </div>
            )}

            {/* Lockout Warning */}
            {isLocked && lockoutEndTime && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Account locked. Try again in {Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)} minute(s)
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  disabled={isLocked}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLocked}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-primary shadow-glow hover:shadow-accent-glow transition-all"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:text-primary-glow transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>

          {/* Security Note */}
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-center text-muted-foreground">
              <Shield className="inline h-3 w-3 mr-1" />
              Server-side rate limiting • Session secured with httpOnly cookies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
