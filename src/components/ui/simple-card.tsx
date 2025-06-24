
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface SimpleCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  children,
  className,
  headerClassName
}) => {
  return (
    <Card className={cn("border-2 shadow-sm hover:shadow-md transition-shadow", className)}>
      {title && (
        <CardHeader className={cn("pb-3", headerClassName)}>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
