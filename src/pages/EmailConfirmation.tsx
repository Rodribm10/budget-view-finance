
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('🔐 Iniciando processo de confirmação de email...');
        console.log('📍 URL atual:', window.location.href);
        console.log('🔗 Hash:', window.location.hash);
        console.log('🔗 Search:', window.location.search);

        // Aguardar um momento para garantir que a URL está totalmente carregada
        await new Promise(resolve => setTimeout(resolve, 100));

        // Primeiro, verificar se já existe uma sessão ativa
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log('📋 Sessão existente:', existingSession ? 'presente' : 'ausente');

        if (existingSession) {
          console.log('✅ Usuário já autenticado, redirecionando...');
          setStatus('success');
          setMessage('Email já confirmado! Redirecionando para o dashboard...');
          toast.success("Bem-vindo!", {
            description: "Você já está logado. Redirecionando...",
          });
          
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
          return;
        }

        // Verificar tokens no hash fragment (formato mais comum)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('type');
        const errorCode = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Verificar tokens nos query params (formato antigo)
        const searchParams = new URLSearchParams(window.location.search);
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        console.log('📋 Tokens encontrados:', {
          accessToken: accessToken ? 'presente' : 'ausente',
          refreshToken: refreshToken ? 'presente' : 'ausente',
          tokenType,
          tokenHash: tokenHash ? 'presente' : 'ausente',
          type,
          error: errorCode,
          errorDescription
        });

        // Verificar se há erro na URL
        if (errorCode) {
          console.error('❌ Erro na URL:', errorCode, errorDescription);
          setStatus('error');
          setMessage('Link de confirmação expirado ou inválido. Tente fazer login novamente.');
          toast.error("Link expirado", {
            description: "O link de confirmação expirou. Tente fazer login para receber um novo email.",
          });
          return;
        }

        let confirmationSuccess = false;

        // Processar tokens do hash fragment (formato mais comum do Supabase)
        if (accessToken && refreshToken) {
          console.log('✅ Processando tokens do hash fragment...');
          
          try {
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
          } catch (sessionError) {
            console.error('❌ Erro na sessão:', sessionError);
            // Tentar método alternativo se setSession falhar
            try {
              console.log('🔄 Tentando método alternativo...');
              const { error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: accessToken,
                type: 'signup',
              });
              
              if (!verifyError) {
                confirmationSuccess = true;
              } else {
                throw verifyError;
              }
            } catch (altError) {
              console.error('❌ Método alternativo também falhou:', altError);
              throw altError;
            }
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

        // Verificar resultado da confirmação
        if (confirmationSuccess) {
          // Aguardar um momento para a sessão ser estabelecida
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verificar se a sessão foi realmente estabelecida
          const { data: { session: newSession } } = await supabase.auth.getSession();
          
          if (newSession) {
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
        } else if (!accessToken && !refreshToken && !tokenHash) {
          // Nenhum token encontrado
          console.warn('⚠️ Nenhum token válido encontrado na URL');
          setStatus('error');
          setMessage('Link de confirmação inválido. Verifique se você clicou no link correto do email.');
          toast.error("Link inválido", {
            description: "Este link de confirmação não é válido.",
          });
        } else {
          // Tokens encontrados mas processamento falhou
          console.error('❌ Tokens encontrados mas processamento falhou');
          setStatus('error');
          setMessage('Erro ao processar confirmação. O link pode ter expirado.');
          toast.error("Erro na confirmação", {
            description: "O link de confirmação pode ter expirado. Tente fazer login novamente.",
          });
        }

      } catch (error) {
        console.error('💥 Erro geral na confirmação:', error);
        setStatus('error');
        setMessage('Ocorreu um erro inesperado. Tente novamente.');
        toast.error("Erro inesperado", {
          description: "Ocorreu um erro ao processar a confirmação.",
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
            {status === 'loading' && "Processando confirmação do seu email..."}
            {status === 'success' && "Email confirmado com sucesso!"}
            {status === 'error' && "Problema na confirmação"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <p className="text-center text-muted-foreground">
                  Aguarde enquanto confirmamos seu email...
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
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
            
            {status === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-red-600" />
                <p className="text-center text-red-700 font-medium">
                  {message}
                </p>
                <Button onClick={handleBackToLogin} className="w-full">
                  Voltar para Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
