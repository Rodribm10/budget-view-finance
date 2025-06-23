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
        
        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('nome, whatsapp')
          .eq('email', userEmail.toLowerCase().trim())
          .single();

        if (error) {
          console.error('❌ Erro ao verificar perfil:', error);
          setProfileComplete(false);
        } else if (usuario) {
          // Verificar se tem nome REAL (não placeholder) e whatsapp válido
          const hasRealName = usuario.nome && 
                             usuario.nome.trim() !== '' && 
                             usuario.nome !== 'Nome não informado';
          const hasValidWhatsApp = usuario.whatsapp && 
                                  usuario.whatsapp.trim() !== '' && 
                                  usuario.whatsapp !== '00000000000' &&
                                  usuario.whatsapp.length >= 10;
          
          const isComplete = hasRealName && hasValidWhatsApp;
          console.log('📋 Perfil completo:', isComplete, { 
            nome: usuario.nome, 
            whatsapp: usuario.whatsapp,
            hasRealName,
            hasValidWhatsApp 
          });
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
