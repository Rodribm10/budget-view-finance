
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔐 Iniciando processo de confirmação de email...');
        console.log('📍 URL atual:', window.location.href);
        console.log('🔗 Hash:', window.location.hash);
        console.log('🔗 Search:', window.location.search);

        // Verificar se há erros explícitos na URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const errorFromUrl = urlParams.get('error') || hashParams.get('error');
        const errorCode = urlParams.get('error_code') || hashParams.get('error_code');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        console.log('🔍 Verificando erros na URL:', {
          error: errorFromUrl,
          errorCode,
          errorDescription
        });

        // Tratar erros específicos
        if (errorFromUrl) {
          console.error('❌ Erro detectado na URL:', errorFromUrl, errorDescription);
          
          if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
            setStatus('expired');
            setMessage('O link de confirmação expirou. Solicite um novo email de confirmação.');
            toast.error("Link expirado", {
              description: "Faça login novamente para receber um novo email de confirmação.",
            });
            return;
          }
          
          setStatus('error');
          setMessage('Link de confirmação inválido ou com problema. Tente fazer login novamente.');
          toast.error("Erro na confirmação", {
            description: errorDescription || "Link inválido",
          });
          return;
        }

        // Verificar tokens no hash fragment (formato padrão do Supabase)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('type');

        // Verificar tokens nos query params (formato antigo)
        const tokenHash = urlParams.get('token_hash');
        const type = urlParams.get('type');

        console.log('📋 Tokens encontrados:', {
          accessToken: accessToken ? 'presente' : 'ausente',
          refreshToken: refreshToken ? 'presente' : 'ausente',
          tokenType,
          tokenHash: tokenHash ? 'presente' : 'ausente',
          type
        });

        let confirmationSuccess = false;

        // Processar tokens do hash fragment (formato mais comum)
        if (accessToken && refreshToken && tokenType) {
          console.log('✅ Processando tokens do hash fragment...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Erro ao definir sessão:', error);
            throw error;
          } else {
            console.log('✅ Sessão definida com sucesso:', data);
            confirmationSuccess = true;
          }
        }
        // Processar tokens dos query params (formato antigo)
        else if (tokenHash && type) {
          console.log('✅ Processando tokens dos query params...');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (error) {
            console.error('❌ Erro na verificação OTP:', error);
            throw error;
          } else {
            console.log('✅ OTP verificado com sucesso:', data);
            confirmationSuccess = true;
          }
        }

        if (confirmationSuccess) {
          // Aguardar um momento para a sessão ser estabelecida
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verificar se a sessão foi estabelecida
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('✅ Confirmação bem-sucedida com sessão ativa');
            setStatus('success');
            setMessage('Email confirmado com sucesso! Redirecionando para o dashboard...');
            toast.success("Email confirmado!", {
              description: "Sua conta foi ativada com sucesso. Redirecionando...",
            });
            
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          } else {
            console.log('⚠️ Confirmação processada mas sem sessão ativa');
            setStatus('success');
            setMessage('Email confirmado com sucesso! Você pode fazer login agora.');
            toast.success("Email confirmado!", {
              description: "Sua conta foi ativada. Faça login para continuar.",
            });
          }
        } else {
          // Nenhum token válido encontrado
          console.warn('⚠️ Nenhum token válido encontrado na URL');
          setStatus('error');
          setMessage('Link de confirmação inválido. Verifique se você clicou no link correto do email.');
          toast.error("Link inválido", {
            description: "Este link de confirmação não é válido.",
          });
        }

      } catch (error) {
        console.error('💥 Erro geral na confirmação:', error);
        setStatus('error');
        setMessage('Ocorreu um erro inesperado. Tente fazer login normalmente.');
        toast.error("Erro inesperado", {
          description: "Tente fazer login normalmente.",
        });
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleResendEmail = () => {
    // Redirecionar para o login para que o usuário possa solicitar novo email
    navigate('/auth', { 
      state: { 
        showSuccessMessage: true, 
        message: "Faça login novamente para receber um novo email de confirmação." 
      } 
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'expired':
        return <AlertTriangle className="h-12 w-12 text-orange-600" />;
      case 'error':
      default:
        return <XCircle className="h-12 w-12 text-red-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return "Processando confirmação do seu email...";
      case 'success':
        return "Email confirmado com sucesso!";
      case 'expired':
        return "Link de confirmação expirado";
      case 'error':
      default:
        return "Problema na confirmação";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/7149adf3-440a-491e-83c2-d964a3348cc9.png" 
              alt="Finance Home Logo" 
              className="h-8 w-8"
            />
            <CardTitle className="text-xl font-bold text-blue-700">Finance Home</CardTitle>
          </div>
          <CardDescription>
            {getStatusMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                {getStatusIcon()}
                <p className="text-center text-muted-foreground">
                  Aguarde enquanto confirmamos seu email...
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                {getStatusIcon()}
                <p className="text-center text-green-700 font-medium">
                  {message}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <Button onClick={handleGoToDashboard} className="w-full bg-blue-600 hover:bg-blue-700">
                    Ir para Dashboard
                  </Button>
                  <Button onClick={handleBackToLogin} variant="outline" className="w-full">
                    Fazer Login
                  </Button>
                </div>
              </>
            )}
            
            {status === 'expired' && (
              <>
                {getStatusIcon()}
                <p className="text-center text-orange-700 font-medium">
                  {message}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <Button onClick={handleResendEmail} className="w-full bg-orange-600 hover:bg-orange-700">
                    Solicitar Novo Email
                  </Button>
                  <Button onClick={handleBackToLogin} variant="outline" className="w-full">
                    Voltar para Login
                  </Button>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                {getStatusIcon()}
                <p className="text-center text-red-700 font-medium">
                  {message}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <Button onClick={handleResendEmail} className="w-full bg-blue-600 hover:bg-blue-700">
                    Solicitar Novo Email
                  </Button>
                  <Button onClick={handleBackToLogin} variant="outline" className="w-full">
                    Voltar para Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
