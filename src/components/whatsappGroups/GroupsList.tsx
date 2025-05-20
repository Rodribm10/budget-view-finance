
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare } from 'lucide-react';
import { WhatsAppGroup } from '@/types/financialTypes';

interface GroupsListProps {
  grupos: WhatsAppGroup[];
  carregando: boolean;
}

const GroupsList = ({ grupos, carregando }: GroupsListProps) => {
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
        ) : grupos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome do grupo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupos.map((grupo) => (
                <TableRow key={grupo.id}>
                  <TableCell className="font-medium">{grupo.id}</TableCell>
                  <TableCell>
                    {grupo.nome_grupo || (
                      <span className="text-muted-foreground italic">
                        {grupo.remote_jid ? 'Sem nome definido' : 'Aguardando vínculo...'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={grupo.remote_jid ? "success" : "outline"}>
                      {grupo.remote_jid ? 'Ativo' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {grupo.workflow_id ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Configurado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Não configurado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(grupo.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
