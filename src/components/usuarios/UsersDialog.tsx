
import React from "react";
import UsersList from "./UsersList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRoundSearch } from "lucide-react";

interface UsersDialogProps {
  trigger?: React.ReactNode;
}

export function UsersDialog({ trigger }: UsersDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <UserRoundSearch className="h-4 w-4" />
            <span>Usuários</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Usuários</DialogTitle>
          <DialogDescription>
            Visualize e gerencie os usuários cadastrados na plataforma
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <UsersList />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UsersDialog;
