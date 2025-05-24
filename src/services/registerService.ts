
import { supabase } from "@/integrations/supabase/client";
import { enviarDadosParaWebhook } from '@/utils/webhookService';

export interface UserRegistrationData {
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
  senha: string;
}

export const registerUser = async (userData: UserRegistrationData) => {
  const { nome, empresa, email, senha, whatsapp } = userData;
  
  // Removemos formatação antes de enviar para o banco
  const whatsappLimpo = whatsapp.replace(/\D/g, '');
  
  // Registrar o usuário usando a função RPC do Supabase
  const { data, error } = await supabase.rpc('registrar_usuario', {
    nome,
    empresa: empresa || null,
    email,
    senha,
    whatsapp: whatsappLimpo
  });
  
  if (error) throw error;
  
  if (data) {
    // Preparar os dados do usuário para enviar ao webhook
    const dadosUsuario = {
      nome,
      empresa,
      email,
      whatsapp: whatsappLimpo,
      data_cadastro: new Date().toISOString(),
      origem: window.location.origin,
    };
    
    // Enviar dados do usuário para o webhook
    await enviarDadosParaWebhook(dadosUsuario);
    
    return { userId: data, whatsappLimpo };
  }
  
  throw new Error("Falha no registro do usuário");
};

export const loginAfterRegister = async (email: string, senha: string) => {
  const { data, error } = await supabase.rpc('autenticar_usuario', {
    email_login: email,
    senha_login: senha
  });
  
  if (error) throw error;
  return data;
};
