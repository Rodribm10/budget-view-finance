
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export type ConfirmationStatus = 'loading' | 'success' | 'error' | 'expired';

export const useEmailConfirmation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConfirmationStatus>('loading');
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

  return { status, message };
};
