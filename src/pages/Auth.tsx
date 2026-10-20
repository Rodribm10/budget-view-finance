
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { toast } from "sonner";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const location = useLocation();

  // Show success message when redirected from registration or email confirmation
  useEffect(() => {
    if (location.state?.showSuccessMessage && location.state?.message) {
      toast.success("Sucesso!", {
        description: location.state.message,
        duration: 8000,
      });
      // Set active tab to login
      setActiveTab("login");
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // SEO
  useEffect(() => {
    document.title = "Login | Finance Home";
  }, []);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab("login");
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        
        <Link to="/" className="absolute top-4 left-4 z-30">
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        
        <div className="relative z-20 glass-card rounded-lg">
          <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      
      {/* Botão para voltar à landing page */}
      <Link to="/" className="absolute top-4 left-4 z-30">
        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Link>
      
      <Card className="w-full max-w-md rounded-2xl border bg-card shadow-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/logo.svg" 
              alt="Finance Home Logo" 
              className="h-10 w-10 rounded-xl"
            />
            <CardTitle className="text-2xl font-semibold tracking-tight">Finance Home</CardTitle>
          </div>
          <CardDescription>Suas finanças da casa, em um lugar só</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sem cadastro: uso pessoal. Acesso liberado em usuarios.liberado_permanente. */}
          <div className="space-y-4">
            <LoginForm 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              onForgotPassword={handleForgotPassword}
            />
            <SocialLoginButtons />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            Ao continuar, você concorda com nossos termos de serviço e políticas de privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
