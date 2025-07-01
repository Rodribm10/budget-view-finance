
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createWhatsAppInstance } from '@/services/whatsAppService';
import { updateUserWhatsAppInstance } from '@/services/whatsAppInstanceService';
import { activateUserWorkflow } from '@/services/whatsAppInstance/workflowOperations';
import { WhatsAppInstance } from '@/types/whatsAppTypes';

export const useInstanceCreation = (
  userEmail: string,
  currentUserId: string,
  onInstanceCreated: (instance: WhatsAppInstance) => void,
  setHasExistingInstance: (value: boolean) => void,
  setExistingInstanceData: (data: any) => void
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createInstance = async (ddd: string, phoneNumber: string) => {
    const instanceName = userEmail;
    const fullPhoneNumber = `55${ddd}${phoneNumber}`;

    // Validations
    if (!userEmail) {
      toast({
        title: "Erro",
        description: "Email do usuário não encontrado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!ddd.trim() || !/^[0-9]{2}$/.test(ddd)) {
      toast({
        title: "Erro",
        description: "Insira um DDD válido com 2 dígitos (ex: 11, 21, 31)",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.trim() || !/^[0-9]{8,9}$/.test(phoneNumber)) {
      toast({
        title: "Erro",
        description: "Insira um número válido com 8 ou 9 dígitos (ex: 987654321)",
        variant: "destructive",
      });
      return;
    }

    if (!currentUserId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma instância",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log(`🚀 [INSTÂNCIA] Iniciando criação de instância com nome ${instanceName} e número ${fullPhoneNumber}`);
      
      // 1. Criar instância na API
      console.log('📡 [INSTÂNCIA] Passo 1: Criando instância na API...');
      const data = await createWhatsAppInstance(instanceName, fullPhoneNumber);
      console.log('✅ [INSTÂNCIA] Resposta da API de criação de instância:', data);

      // 2. Atualizar o banco de dados com status "conectado"
      console.log('💾 [INSTÂNCIA] Passo 2: Atualizando banco de dados...');
      await updateUserWhatsAppInstance(userEmail, {
        instanceName,
        status: 'conectado'
      });
      console.log('✅ [INSTÂNCIA] Instância registrada no banco de dados com status "conectado"');

      // 3. Ativar o workflow do usuário no n8n - CORRIGINDO AQUI
      console.log('🔄 [INSTÂNCIA] Passo 3: Ativando workflow do usuário no n8n...');
      try {
        console.log(`🔔 Enviando webhook ativarworkflow para usuário: ${userEmail}`);
        await activateUserWorkflow(userEmail);
        console.log('✅ [INSTÂNCIA] Webhook ativarworkflow enviado com sucesso');
      } catch (workflowError) {
        console.error('⚠️ [INSTÂNCIA] Erro ao enviar webhook ativarworkflow:', workflowError);
        toast({
          title: "Aviso",
          description: "Instância criada, mas houve um problema ao ativar a automação. Entre em contato com o suporte.",
          variant: "destructive",
        });
      }

      // 4. Criar objeto da instância
      const newInstance: WhatsAppInstance = {
        instanceName,
        instanceId: instanceName,
        phoneNumber: fullPhoneNumber,
        userId: currentUserId,
        status: data.instance?.status || 'created',
        qrcode: data.qrcode?.base64 || null,
        connectionState: 'closed'
      };
      
      console.log('✅ [INSTÂNCIA] Nova instância criada:', newInstance);
      
      // 5. Atualizar estado para evitar nova criação
      setHasExistingInstance(true);
      setExistingInstanceData({
        instancia_zap: instanceName,
        status_instancia: 'conectado'
      });
      
      // 6. Notificar componente pai
      onInstanceCreated(newInstance);
      
      // 7. Forçar um pequeno delay para garantir que o banco foi atualizado
      console.log('⏳ [INSTÂNCIA] Aguardando propagação das mudanças no banco...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sucesso!",
        description: "Instância do WhatsApp criada e ativada com sucesso! Agora você pode criar grupos.",
        duration: 5000
      });
      
      return true;
      
    } catch (error) {
      console.error("💥 [INSTÂNCIA] Erro ao criar instância WhatsApp:", error);
      
      // Se houve erro na API, tentar reverter no banco de dados
      try {
        await updateUserWhatsAppInstance(userEmail, {
          instanceName: '',
          status: 'desconectado'
        });
        console.log('🔄 [INSTÂNCIA] Instância removida do banco devido ao erro na API');
      } catch (dbError) {
        console.error('❌ [INSTÂNCIA] Erro ao reverter instância no banco:', dbError);
      }
      
      toast({
        title: "Erro na criação da instância",
        description: "Ocorreu um erro ao conectar com a API. Tente novamente mais tarde.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createInstance
  };
};
