
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authStore } from '@/stores/authStore';

export const useProfileCompletion = (userEmail: string) => {
  const [isChecking, setIsChecking] = useState(true);
  const setProfileComplete = authStore((state) => state.setProfileComplete);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!userEmail) {
        setIsChecking(false);
        return;
      }

      try {
        console.log('🔍 Verificando completude do perfil para:', userEmail);
        
        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('nome, whatsapp')
          .eq('email', userEmail.toLowerCase().trim())
          .single();

        if (error) {
          console.error('❌ Erro ao verificar perfil:', error);
          setProfileComplete(false);
        } else if (usuario) {
          // Verificar se tem nome e whatsapp preenchidos
          const isComplete = !!(usuario.nome?.trim() && usuario.whatsapp?.trim());
          console.log('📋 Perfil completo:', isComplete, { nome: usuario.nome, whatsapp: usuario.whatsapp });
          setProfileComplete(isComplete);
        } else {
          console.log('👤 Usuário não encontrado na tabela usuarios');
          setProfileComplete(false);
        }
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
