
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { toast } from "sonner";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const location = useLocation();

  // Show success message when redirected from registration
  useEffect(() => {
    if (location.state?.showSuccessMessage && location.state?.message) {
      toast.success("Cadastro realizado!", {
        description: location.state.message,
        duration: 8000,
      });
      // Set active tab to login
      setActiveTab("login");
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Finanças Pessoais</CardTitle>
          <CardDescription>Gerencie suas finanças de forma simples e eficiente</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
            </TabsContent>
            
            <TabsContent value="cadastro">
              <RegisterForm isLoading={isLoading} setIsLoading={setIsLoading} />
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
