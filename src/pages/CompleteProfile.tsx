
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { authStore } from '@/stores/authStore';
import { sendNewUserWebhook } from '@/services/newUserWebhookService';
import { formatarWhatsapp } from '@/utils/whatsappFormatter';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [whatsapp, setWhatsapp] = useState('55');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  
  const setProfileComplete = authStore((state) => state.setProfileComplete);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        setUserId(user.id);
        
        console.log('👤 Dados do usuário Google:', user.user_metadata);
        
        // Pre-fill nome if available from Google
        const displayName = user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           user.user_metadata?.display_name || '';
        if (displayName && displayName !== 'Nome não informado') {
          setNome(displayName);
        }
      } else {
        // Se não há usuário logado, redirecionar para auth
        navigate('/auth');
      }
    };

    getUserData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!nome.trim() || nome.trim().length < 2) {
      toast.error("Nome obrigatório", { 
        description: "Por favor, informe seu nome completo (mínimo 2 caracteres)." 
      });
      return;
    }

    if (!whatsapp || whatsapp.replace(/\D/g, '').length < 11) {
      toast.error("WhatsApp obrigatório", { 
        description: "Por favor, informe um número de WhatsApp válido." 
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Salvando dados complementares do perfil...');
      const whatsappOnly = whatsapp.replace(/\D/g, '');
      
      // Atualizar dados do usuário no Supabase
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          nome: nome.trim(),
          empresa: empresa.trim() || null,
          whatsapp: whatsappOnly
        })
        .eq('email', userEmail.toLowerCase().trim());

      if (updateError) {
        console.error('❌ Erro ao atualizar usuário:', updateError);
        throw new Error('Erro ao salvar dados do perfil');
      }

      console.log('✅ Dados do perfil salvos com sucesso');

      // Enviar webhook para N8N
      console.log('📡 Enviando webhook para N8N...');
      const webhookSuccess = await sendNewUserWebhook(
        userEmail, 
        userId, 
        whatsappOnly
      );

      if (webhookSuccess) {
        console.log('✅ Webhook N8N enviado com sucesso');
        toast.success("Perfil completado!", {
          description: "Seus dados foram salvos e seu workspace está sendo configurado.",
        });
      } else {
        console.warn('⚠️ Falha no webhook N8N, mas perfil foi salvo');
        toast.success("Perfil completado!", {
          description: "Seus dados foram salvos. A configuração do workspace pode demorar alguns minutos.",
        });
      }

      // Marcar perfil como completo
      setProfileComplete(true);

      // Redirecionar para dashboard
      navigate('/');

    } catch (error) {
      console.error('❌ Erro ao completar perfil:', error);
      toast.error("Erro ao salvar dados", {
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappChange = (value: string) => {
    setWhatsapp(formatarWhatsapp(value));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Complete seu Perfil</CardTitle>
          <CardDescription>
            Para continuar, precisamos de algumas informações obrigatórias para configurar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa (Opcional)</Label>
              <Input
                id="empresa"
                type="text"
                placeholder="Nome da sua empresa"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Necessário para integração com WhatsApp e notificações
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Completar Perfil"}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Por que estes dados?</strong><br />
              Nome e WhatsApp são necessários para configurar automaticamente seu workspace e integrações personalizadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
