/**
 * Authentication Hook
 * 
 * Security Features:
 * - Secure session management with httpOnly cookies (handled by Supabase)
 * - Auto token refresh to maintain session
 * - CSRF protection built into Supabase
 * - Password hashing with bcrypt (handled by Supabase Auth)
 */

import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log authentication events (for security monitoring)
        if (event === 'SIGNED_IN') {
          console.log('[Security] User signed in');
        } else if (event === 'SIGNED_OUT') {
          console.log('[Security] User signed out');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign up new user
   * Security: Password is automatically hashed by Supabase using bcrypt
   */
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      // Create auth user (password automatically hashed with bcrypt)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) throw authError;

      // Create profile record
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: authData.user.id,
            username,
            email,
          });

        if (profileError) throw profileError;

        // Log successful signup
        await (supabase as any).rpc('log_security_event', {
          p_user_id: authData.user.id,
          p_event_type: 'signup_success',
          p_event_details: { method: 'email_password', username },
          p_ip_address: null,
          p_user_agent: navigator.userAgent
        });

        toast({
          title: "Account created successfully!",
          description: "You can now log in with your credentials.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error("[Security] Signup error:", error);
      
      // Log failed signup attempt
      await (supabase as any).rpc('log_security_event', {
        p_user_id: null,
        p_event_type: 'signup_failed',
        p_event_details: { email, reason: 'registration_error' },
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
      
      return { error };
    }
  };

  /**
   * Sign in existing user
   * Security: Credentials verified against hashed password in database
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login time
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("user_id", data.user.id);
        
        // Log successful login
        await (supabase as any).rpc('log_security_event', {
          p_user_id: data.user.id,
          p_event_type: 'login_success',
          p_event_details: { method: 'password' },
          p_ip_address: null,
          p_user_agent: navigator.userAgent
        });
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error("[Security] Login error:", error);
      
      // Log failed login attempt
      await (supabase as any).rpc('log_security_event', {
        p_user_id: null,
        p_event_type: 'login_failed',
        p_event_details: { email, reason: 'invalid_credentials' },
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
      
      return { error };
    }
  };

  /**
   * Sign out user
   * Security: Clears session and auth tokens
   */
  const signOut = async () => {
    try {
      const currentUserId = user?.id;
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Log successful logout
      if (currentUserId) {
        await (supabase as any).rpc('log_security_event', {
          p_user_id: currentUserId,
          p_event_type: 'logout_success',
          p_event_details: { method: 'manual' },
          p_ip_address: null,
          p_user_agent: navigator.userAgent
        });
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });

      return { error: null };
    } catch (error: any) {
      console.error("[Security] Logout error:", error);
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
