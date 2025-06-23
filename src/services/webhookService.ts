
// URL do webhook para notificação de novo cadastro
const WEBHOOK_URL = "https://hook.us1.make.com/j6y1odto82tyo38qv3jh4579kkluhsx7";

// URL do webhook para fale conosco
const FALE_CONOSCO_WEBHOOK_URL = "https://webhookn8n.innova1001.com.br/webhook/faleconosco";

interface UserData {
  nome: string;
  empresa?: string;
  email: string;
  whatsapp?: string;
  data_cadastro: string;
  origem: string;
}

interface FaleConoscoData {
  assunto: string;
  motivo: string;
  mensagem: string;
  anexo_url?: string;
  user_id?: string;
  user_email?: string;
  data_envio: string;
}

// Função para enviar dados do usuário para o webhook
export const enviarDadosParaWebhook = async (dadosUsuario: UserData) => {
  try {
    console.log("Enviando dados do usuário para webhook:", dadosUsuario);
    
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Necessário para webhooks externos
      body: JSON.stringify(dadosUsuario),
    });
    
    console.log("Dados enviados com sucesso para o webhook");
  } catch (error) {
    console.error("Erro ao enviar dados para o webhook:", error);
  }
};

// Função para enviar dados do Fale Conosco para o webhook do N8N
export const enviarFaleConoscoParaWebhook = async (dadosFaleConosco: FaleConoscoData) => {
  try {
    console.log("Enviando dados do Fale Conosco para webhook N8N:", dadosFaleConosco);
    
    const response = await fetch(FALE_CONOSCO_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosFaleConosco),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log("Dados do Fale Conosco enviados com sucesso para o webhook N8N");
    return true;
  } catch (error) {
    console.error("Erro ao enviar dados do Fale Conosco para o webhook N8N:", error);
    throw error;
  }
};
