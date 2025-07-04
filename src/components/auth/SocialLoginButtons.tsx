
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const SocialLoginButtons = () => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    
    try {
      console.log('🔐 Iniciando login com Google...');
      console.log('🌐 URL atual:', window.location.origin);
      
      // Determinar a URL de redirecionamento correta baseada no hostname
      let redirectUrl;
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost') {
        redirectUrl = 'http://localhost:3000/';
      } else if (hostname.includes('financehome.innova1001.com.br')) {
        redirectUrl = 'https://financehome.innova1001.com.br/';
      } else if (hostname.includes('lovableproject.com')) {
        redirectUrl = `${window.location.origin}/`;
      } else {
        // Fallback para qualquer outro domínio
        redirectUrl = `${window.location.origin}/`;
      }
      
      console.log('🔗 URL de redirecionamento:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });

      console.log('📊 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro no login com Google:', error);
        toast.error("Erro no login com Google", {
          description: error.message || "Não foi possível conectar com o Google. Verifique as configurações.",
        });
      } else {
        console.log('✅ Redirecionamento iniciado...');
        // Não fazer nada aqui, deixar o redirecionamento acontecer naturalmente
      }
    } catch (error) {
      console.error('❌ Erro geral no login com Google:', error);
      toast.error("Erro no login", {
        description: "Ocorreu um erro inesperado. Verifique as configurações do Google.",
      });
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>
      
      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loadingGoogle}
        className="w-full"
      >
        {loadingGoogle ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
            Conectando...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </>
        )}
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
