
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  connectionStatus: string;
}

const StatusBadge = ({ connectionStatus }: StatusBadgeProps) => {
  if (connectionStatus === 'open') {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-300">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
        Status: Conectado
      </Badge>
    );
  } else if (connectionStatus === 'connecting') {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-orange-500 border-orange-300">
        <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
        Status: Conectando
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-300">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
        Status: Desconectado
      </Badge>
    );
  }
};

export default StatusBadge;
