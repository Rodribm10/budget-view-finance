
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';

interface GroupCreationFormProps {
  userInstance: {
    instancia_zap: string | null;
    status_instancia: string | null;
    whatsapp: string | null;
  };
  userEmail: string;
  cadastrando: boolean;
  onSubmit: (nomeGrupo: string) => void;
}

const GroupCreationForm = ({ userInstance, userEmail, cadastrando, onSubmit }: GroupCreationFormProps) => {
  const [nomeGrupo, setNomeGrupo] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(nomeGrupo);
    setNomeGrupo(''); // Reset form after submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar novo grupo</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para cadastrar um novo grupo do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mostrar informações da instância conectada */}
        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
          <p className="text-green-800">
            <strong>✓ Instância conectada:</strong> {userInstance?.instancia_zap}
          </p>
          <p className="text-green-700">
            Status: {userInstance?.status_instancia}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nomeGrupo">Nome do grupo</Label>
          <Input 
            id="nomeGrupo" 
            placeholder="Ex: Controle de Gastos da Família" 
            value={nomeGrupo} 
            onChange={(e) => setNomeGrupo(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Digite um nome descritivo para o grupo que você irá criar
          </p>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={cadastrando || !userEmail || !nomeGrupo.trim()}
          className="w-full"
        >
          {cadastrando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              Cadastrando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" /> 
              Cadastrar Grupo
            </>
          )}
        </Button>
        
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium mb-2">Informações importantes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>O grupo será criado automaticamente no seu WhatsApp</li>
            <li>Você será adicionado como participante do grupo</li>
            <li>O grupo terá o nome que você escolheu: {nomeGrupo || 'Digite um nome acima'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCreationForm;
