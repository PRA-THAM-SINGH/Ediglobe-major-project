/**
 * Security Badge Component
 * Displays security features implemented in the application
 */

import { Shield, Lock, Eye, KeyRound, Database, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SecurityFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const securityFeatures: SecurityFeature[] = [
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Password Hashing",
    description: "bcrypt encryption with salt rounds",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "SQL Injection Protection",
    description: "Parameterized queries only",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "XSS Protection",
    description: "Auto-escaped output & validation",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "CSRF Protection",
    description: "Token-based request validation",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Secure Sessions",
    description: "httpOnly cookies with SameSite",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Input Validation",
    description: "Zod schema validation",
  },
];

const SecurityBadge = () => {
  return (
    <Card className="p-6 bg-gradient-card border-primary/20">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        Security Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityFeatures.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 transition-all hover:border-primary/50 hover:shadow-glow"
          >
            <div className="p-2 rounded bg-primary/10 text-primary">
              {feature.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SecurityBadge;
