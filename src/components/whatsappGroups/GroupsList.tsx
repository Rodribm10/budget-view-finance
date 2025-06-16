
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { WhatsAppGroup } from '@/types/financialTypes';
import GroupCard from './GroupCard';

interface GroupsListProps {
  grupos: WhatsAppGroup[];
  carregando: boolean;
  onDeleteGroup: (groupId: number) => void;
}

const GroupsList = ({ grupos, carregando, onDeleteGroup }: GroupsListProps) => {
  // Filtrar apenas grupos que têm nome_grupo preenchido
  const gruposComNome = grupos.filter(grupo => grupo.nome_grupo && grupo.nome_grupo.trim() !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seus grupos cadastrados</CardTitle>
        <CardDescription>
          Lista de grupos do WhatsApp que você cadastrou
        </CardDescription>
      </CardHeader>
      <CardContent>
        {carregando ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : gruposComNome.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gruposComNome.map((grupo) => (
              <GroupCard
                key={grupo.id}
                group={grupo}
                onDelete={onDeleteGroup}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
            <p className="text-muted-foreground">Você ainda não cadastrou nenhum grupo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupsList;
