
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";

// Campos que vêm da tabela usuarios:
const camposUsuarios = ["nome", "email", "whatsapp"] as const;
// Campos que vêm da tabela perfis_usuario:
const camposPerfilExtra = [
  "nome_preferido",
  "aniversario",
  "sexo",
  "nacionalidade",
  "cpf",
  "cep",
  "estado",
  "cidade",
  "objetivo_financeiro",
  "participa_pesquisas"
] as const;

type PerfilExtra = {
  nome_preferido: string | null;
  aniversario: string | null;
  sexo: string | null;
  nacionalidade: string | null;
  cpf: string | null;
  cep: string | null;
  estado: string | null;
  cidade: string | null;
  objetivo_financeiro: string | null;
  participa_pesquisas: boolean | null;
};

type Usuario = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
};

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const sexos = ["Feminino","Masculino", "Outro"];

export default function MeuCadastroForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<PerfilExtra>({
    nome_preferido: "",
    aniversario: "",
    sexo: "",
    nacionalidade: "",
    cpf: "",
    cep: "",
    estado: "",
    cidade: "",
    objetivo_financeiro: "",
    participa_pesquisas: false
  });

  const userId = authStore.getState().user?.id;
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Busca os dados da tabela usuarios
      if (!userId) return;
      const { data: usuarioData, error: userError } = await supabase
        .from("usuarios")
        .select("id, nome, email, whatsapp")
        .eq("id", userId)
        .single();

      if (userError || !usuarioData) {
        toast({ title: "Erro ao carregar cadastro", description: "Não foi possível carregar seus dados.", variant: "destructive" });
        setLoading(false);
        return;
      }

      setUsuario(usuarioData);

      // Busca/perfil da tabela perfis_usuario (pode não existir ainda)
      const { data: perfilData } = await supabase
        .from("perfis_usuario")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      
      if (perfilData) {
        setPerfil({
          ...perfil,
          ...perfilData,
        });
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!userId || !usuario) return;

    // Atualiza tabela usuarios
    const { error: errorUser } = await supabase
      .from("usuarios")
      .update({
        nome: usuario.nome,
        whatsapp: usuario.whatsapp,
      })
      .eq("id", userId);

    // Atualiza/inserir em perfis_usuario
    const { error: errorPerfil } = await supabase
      .from("perfis_usuario")
      .upsert({
        id: userId,
        ...perfil,
        participa_pesquisas: perfil.participa_pesquisas ?? false,
        atualizado_em: new Date().toISOString(),
      });

    setLoading(false);
    if (!errorUser && !errorPerfil) {
      toast({ title: "Cadastro atualizado!", description: "Suas informações foram salvas com sucesso." });
    } else {
      toast({ title: "Erro ao salvar", description: "Tente novamente ou entre em contato." , variant: "destructive"});
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Carregando...</div>;
  }

  if (!usuario) {
    return <div className="py-8 text-center text-destructive">Não foi possível carregar seu perfil.</div>;
  }

  return (
    <form
      className="space-y-5 max-w-xl mx-auto bg-card border rounded-xl p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>Nome completo</Label>
          <Input
            value={usuario.nome}
            onChange={(e) =>
              setUsuario((u) => u ? { ...u, nome: e.target.value } : u)
            }
            required
          />
        </div>
        <div>
          <Label>E-mail</Label>
          <Input value={usuario.email} disabled className="bg-muted" />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input
            value={usuario.whatsapp}
            onChange={(e) =>
              setUsuario((u) => u ? { ...u, whatsapp: e.target.value } : u)
            }
            required
          />
        </div>
        <div>
          <Label>Nome preferido</Label>
          <Input
            value={perfil.nome_preferido ?? ""}
            onChange={e =>
              setPerfil(p => ({ ...p, nome_preferido: e.target.value }))
            }
          />
        </div>
        <div>
          <Label>CPF</Label>
          <Input
            value={perfil.cpf ?? ""}
            onChange={e => setPerfil(p => ({ ...p, cpf: e.target.value }))}
          />
        </div>
        <div>
          <Label>CEP</Label>
          <Input
            value={perfil.cep ?? ""}
            onChange={e => setPerfil(p => ({ ...p, cep: e.target.value }))}
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Select
            value={perfil.estado ?? ""}
            onValueChange={estado => setPerfil(p => ({ ...p, estado }))}
          >
            <SelectTrigger>
              <span>{perfil.estado || "Selecione..."}</span>
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Cidade</Label>
          <Input
            value={perfil.cidade ?? ""}
            onChange={e => setPerfil(p => ({ ...p, cidade: e.target.value }))}
          />
        </div>
        <div>
          <Label>Aniversário</Label>
          <Input
            type="date"
            value={perfil.aniversario ?? ""}
            onChange={e => setPerfil(p => ({ ...p, aniversario: e.target.value }))}
          />
        </div>
        <div>
          <Label>Sexo</Label>
          <Select
            value={perfil.sexo ?? ""}
            onValueChange={sexo => setPerfil(p => ({ ...p, sexo }))}
          >
            <SelectTrigger>
              <span>{perfil.sexo || "Selecione..."}</span>
            </SelectTrigger>
            <SelectContent>
              {sexos.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Nacionalidade</Label>
          <Input
            value={perfil.nacionalidade ?? ""}
            onChange={e =>
              setPerfil(p => ({ ...p, nacionalidade: e.target.value }))
            }
          />
        </div>
        <div className="md:col-span-2">
          <Label>Objetivo financeiro</Label>
          <Input
            value={perfil.objetivo_financeiro ?? ""}
            onChange={e =>
              setPerfil(p => ({ ...p, objetivo_financeiro: e.target.value }))
            }
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            checked={!!perfil.participa_pesquisas}
            id="participa_pesquisas"
            onChange={e =>
              setPerfil(p => ({
                ...p,
                participa_pesquisas: e.target.checked
              }))
            }
          />
          <Label htmlFor="participa_pesquisas" className="mb-0 cursor-pointer">
            Quero participar de pesquisas e ajudar a melhorar o app
          </Label>
        </div>
      </div>
      <div className="pt-2 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar informações"}
        </Button>
      </div>
    </form>
  );
}
