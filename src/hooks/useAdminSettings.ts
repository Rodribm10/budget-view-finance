
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_EMAIL = 'rodrigobm10@gmail.com';
const SETTINGS_KEY = 'admin_hide_whatsapp_button';

export const useAdminSettings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hideWhatsAppButton, setHideWhatsAppButton] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    loadSettings();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Erro ao verificar status admin:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSetting = localStorage.getItem(SETTINGS_KEY);
      if (savedSetting) {
        setHideWhatsAppButton(JSON.parse(savedSetting));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWhatsAppButton = async () => {
    if (!isAdmin) return;
    
    try {
      const newValue = !hideWhatsAppButton;
      setHideWhatsAppButton(newValue);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newValue));
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  return {
    isAdmin,
    hideWhatsAppButton,
    loading,
    toggleWhatsAppButton
  };
};
