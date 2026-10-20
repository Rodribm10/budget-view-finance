import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export const useProfileCompletion = (userEmail: string) => {
  const [isChecking, setIsChecking] = useState(true);
  const setProfileComplete = useAuthStore((state) => state.setProfileComplete);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!userEmail) {
        setIsChecking(false);
        return;
      }

      try {
        console.log('🔍 Verificando completude do perfil para:', userEmail);
        
        // Uso pessoal: só entra quem está liberado em usuarios (liberado_permanente).
        // O login é o mesmo do Finance Hub, então ter conta não basta.
        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('liberado_permanente')
          .eq('email', userEmail.toLowerCase().trim())
          .maybeSingle();
        if (error) console.error('❌ Erro ao verificar acesso:', error);
        setProfileComplete(usuario?.liberado_permanente === true);
      } catch (error) {
        console.error('❌ Erro na verificação do perfil:', error);
        setProfileComplete(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfileCompletion();
  }, [userEmail, setProfileComplete]);

  return { isChecking };
};
