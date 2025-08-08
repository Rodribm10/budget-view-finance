
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boxes } from "@/components/ui/background-boxes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import AuthSecurityFeatures from '@/components/auth/AuthSecurityFeatures';
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
      <div className="min-h-screen relative w-full overflow-hidden bg-gradient-primary flex items-center justify-center px-4">
        <div className="absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        
        <Link to="/" className="absolute top-4 left-4 z-30">
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
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
    <div className="min-h-screen relative w-full overflow-hidden bg-gradient-primary flex items-center justify-center px-4">
      <div className="absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      <Boxes />
      
      {/* Botão para voltar à landing page */}
      <Link to="/" className="absolute top-4 left-4 z-30">
        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Link>
      
      <Card className="w-full max-w-md relative z-20 glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
              alt="Finance Home Logo" 
              className="h-10 w-10"
            />
            <CardTitle className="text-2xl font-extrabold brand-text">Finance Home</CardTitle>
          </div>
          <CardDescription>Gerencie suas finanças de forma simples e eficiente</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <LoginForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading} 
                onForgotPassword={handleForgotPassword}
              />
              <SocialLoginButtons />
            </TabsContent>
            
            <TabsContent value="cadastro" className="space-y-4">
              <RegisterForm isLoading={isLoading} setIsLoading={setIsLoading} />
              <SocialLoginButtons />
              <AuthSecurityFeatures />
            </TabsContent>
          </Tabs>
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
