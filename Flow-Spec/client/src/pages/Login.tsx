import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Stethoscope } from "lucide-react";

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/50 to-primary/5 p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-enter">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/20 mb-4 text-white">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground mb-2">
            MediBill
          </h1>
          <p className="text-muted-foreground text-lg">
            Anaesthetic Billing Management System
          </p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/5 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your dashboard securely
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
            <Button 
              size="lg" 
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
              onClick={handleLogin}
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Sign in with Replit Auth
            </Button>
            
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Secure access for authorised medical personnel only.</p>
              <p>Contact IT support if you need access.</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground/60">
          &copy; {new Date().getFullYear()} MediBill Systems. All rights reserved.
        </div>
      </div>
    </div>
  );
}
