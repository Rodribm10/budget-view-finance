
export interface RegisterFormData {
  nome: string;
  empresa: string;
  email: string;
  whatsapp: string;
  senha: string;
  confirmaSenha: string;
}

export const validateRegisterForm = (formData: RegisterFormData): string | null => {
  const { nome, email, senha, whatsapp, confirmaSenha } = formData;
  
  if (!nome || !email || !senha || !whatsapp) {
    return "Por favor preencha todos os campos obrigatórios";
  }
  
  if (senha !== confirmaSenha) {
    return "A senha e a confirmação de senha devem ser iguais";
  }
  
  return null;
};
