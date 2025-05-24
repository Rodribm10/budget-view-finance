
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';

interface RegisterFormFieldsProps {
  nome: string;
  setNome: (value: string) => void;
  empresa: string;
  setEmpresa: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  whatsapp: string;
  setWhatsapp: (value: string) => void;
  senha: string;
  setSenha: (value: string) => void;
  confirmaSenha: string;
  setConfirmaSenha: (value: string) => void;
  isLoading: boolean;
}

const RegisterFormFields = ({
  nome,
  setNome,
  empresa,
  setEmpresa,
  email,
  setEmail,
  whatsapp,
  setWhatsapp,
  senha,
  setSenha,
  confirmaSenha,
  setConfirmaSenha,
  isLoading
}: RegisterFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="empresa">Empresa (opcional)</Label>
        <Input
          id="empresa"
          placeholder="Empresa (opcional)"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
        <Input
          id="whatsapp"
          placeholder="55(11)999999999"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirma-senha">Confirme a senha</Label>
        <Input
          id="confirma-senha"
          placeholder="Confirme a senha"
          type="password"
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
    </>
  );
};

export default RegisterFormFields;
