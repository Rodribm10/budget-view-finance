
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
  iconClass?: string;
  valueClass?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  iconClass,
  valueClass,
}) => {
  return (
    <Card className={cn("dashboard-card animate-fade-in", className)}>
      <CardContent className="flex flex-col gap-2 p-6">
        <div className="flex items-center justify-between">
          <div className={cn("p-2 rounded-md", iconClass || "bg-primary/10")}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={cn(
              "text-xs font-medium",
              trend > 0 ? "text-finance-green" : trend < 0 ? "text-finance-red" : "text-muted-foreground"
            )}>
              {trend > 0 && '+'}{trend}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-2xl font-bold", valueClass)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
