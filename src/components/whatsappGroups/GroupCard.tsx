
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Trash2 } from 'lucide-react';
import { WhatsAppGroup } from '@/types/financialTypes';

interface GroupCardProps {
  group: WhatsAppGroup;
  onDelete: (groupId: number) => void;
}

const GroupCard = ({ group, onDelete }: GroupCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">{group.nome_grupo}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(group.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={group.remote_jid ? "success" : "outline"}>
              {group.remote_jid ? 'Ativo' : 'Pendente'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Workflow:</span>
            <Badge variant={group.workflow_id ? "secondary" : "outline"}>
              {group.workflow_id ? 'Configurado' : 'Não configurado'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Criado em:</span>
            <span className="text-sm">{new Date(group.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
