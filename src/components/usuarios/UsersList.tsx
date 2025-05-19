
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserInfo, getUsersRegisteredToday, getAllUsers } from '@/services/userService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const UsersList: React.FC = () => {
  const [usersToday, setUsersToday] = useState<UserInfo[]>([]);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("today");
  const { toast } = useToast();

  const loadUsers = async (tab: string = activeTab) => {
    setLoading(true);
    try {
      if (tab === "today") {
        const users = await getUsersRegisteredToday();
        setUsersToday(users);
      } else {
        const users = await getAllUsers();
        setAllUsers(users);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadUsers(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const displayUsers = activeTab === "today" ? usersToday : allUsers;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Usuários Cadastrados</CardTitle>
        <CardDescription>
          {activeTab === "today" 
            ? `${usersToday.length} usuários cadastrados hoje` 
            : `${allUsers.length} usuários cadastrados no total`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="today">Cadastrados Hoje</TabsTrigger>
            <TabsTrigger value="all">Todos os Usuários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : usersToday.length > 0 ? (
              <div className="space-y-2">
                {usersToday.map((user) => (
                  <div key={user.id} className="border p-4 rounded-md">
                    <div className="font-semibold">{user.nome}</div>
                    <div className="text-sm text-muted-foreground">Email: {user.email}</div>
                    {user.empresa && (
                      <div className="text-sm text-muted-foreground">Empresa: {user.empresa}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Cadastrado em: {formatDate(user.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">Nenhum usuário cadastrado hoje.</div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : allUsers.length > 0 ? (
              <div className="space-y-2">
                {allUsers.map((user) => (
                  <div key={user.id} className="border p-4 rounded-md">
                    <div className="font-semibold">{user.nome}</div>
                    <div className="text-sm text-muted-foreground">Email: {user.email}</div>
                    {user.empresa && (
                      <div className="text-sm text-muted-foreground">Empresa: {user.empresa}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Cadastrado em: {formatDate(user.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">Nenhum usuário cadastrado.</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => loadUsers(activeTab)}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UsersList;
