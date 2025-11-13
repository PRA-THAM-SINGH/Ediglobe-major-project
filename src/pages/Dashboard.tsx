/**
 * Dashboard Page - Protected Route
 * 
 * Security: Only accessible to authenticated users
 * Displays user profile and security information
 */

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield, User, Mail, Calendar, Clock, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import SecurityBadge from "@/components/SecurityBadge";

interface UserProfile {
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-primary shadow-glow">
                <Shield className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {profile?.username || "User"}!
            </h1>
            <p className="text-muted-foreground">
              Your secure dashboard
            </p>
          </div>

          {/* Profile Card */}
          <Card className="p-6 bg-gradient-card border-primary/20 shadow-card">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Profile Information
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-12 bg-secondary/50 animate-pulse rounded" />
                <div className="h-12 bg-secondary/50 animate-pulse rounded" />
                <div className="h-12 bg-secondary/50 animate-pulse rounded" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Username</span>
                  </div>
                  <p className="text-lg font-semibold">{profile?.username}</p>
                </div>

                {/* Email */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                  </div>
                  <p className="text-lg font-semibold break-all">{profile?.email}</p>
                </div>

                {/* Account Created */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Account Created</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(profile?.created_at || null)}</p>
                </div>

                {/* Last Login */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Last Login</span>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(profile?.last_login)}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Session Info */}
          <Card className="p-6 bg-gradient-card border-success/20 shadow-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-success" />
              Session Status
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Session</p>
                <p className="text-lg font-semibold text-success">Active & Secure</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">Protected</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Your session is protected with httpOnly cookies and automatic token refresh
            </p>
          </Card>

          {/* Security Features */}
          <SecurityBadge />

          {/* Security Info */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-center text-muted-foreground">
              <Shield className="inline h-3 w-3 mr-1" />
              All data is protected with Row Level Security (RLS) policies and encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
