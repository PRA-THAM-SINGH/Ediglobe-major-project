/**
 * Home Page - Landing Page
 * Introduces the secure web application and its features
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, KeyRound, Database, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import SecurityBadge from "@/components/SecurityBadge";
import safesignLogo from "@/assets/safesign-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={safesignLogo} 
              alt="SafeSign Logo" 
              className="h-32 w-32 animate-fade-in"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SafeSign
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A demonstration of modern web security practices including authentication, 
            input validation, SQL injection protection, XSS prevention, and secure session management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-accent-glow transition-all">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built with Security in Mind
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Password Hashing</h3>
              <p className="text-muted-foreground">
                Passwords encrypted with bcrypt algorithm using salt rounds for maximum security
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SQL Injection Protection</h3>
              <p className="text-muted-foreground">
                All database queries use parameterized statements to prevent SQL injection attacks
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">XSS Prevention</h3>
              <p className="text-muted-foreground">
                Automatic output escaping and input validation to prevent cross-site scripting
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">CSRF Protection</h3>
              <p className="text-muted-foreground">
                Token-based CSRF protection on all state-changing operations
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Sessions</h3>
              <p className="text-muted-foreground">
                Sessions managed with httpOnly cookies and SameSite protection
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Input Validation</h3>
              <p className="text-muted-foreground">
                Comprehensive validation using Zod schemas for all user inputs
              </p>
            </Card>
          </div>

          {/* Security Features Badge */}
          <SecurityBadge />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto p-12 bg-gradient-card border-primary/20 shadow-card text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Secure Authentication?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your account today and see enterprise-level security in action
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-accent-glow transition-all">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center text-sm text-muted-foreground">
          <p>Built with React, TypeScript, Tailwind CSS, and Lovable Cloud</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Secure by design • Protected by modern security practices
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
