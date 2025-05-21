
// URL do webhook para notificação de novo cadastro
const WEBHOOK_URL = "https://hook.us1.make.com/spgyc1wpkqmep46qzo1h1v1m246luw13";

interface UserData {
  nome: string;
  empresa?: string;
  email: string;
  data_cadastro: string;
  origem: string;
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
