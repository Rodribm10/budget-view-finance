
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  secondaryValue?: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
  iconClass?: string;
  valueClass?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  secondaryValue,
  icon,
  trend,
  className,
  iconClass,
  valueClass,
}) => {
  return (
    <Card className={cn("dashboard-card animate-fade-in border-2", className)}>
      <CardContent className="flex flex-col gap-2 p-6">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-lg", iconClass || "bg-blue-100")}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trend > 0 ? "text-green-700 bg-green-100" : trend < 0 ? "text-red-700 bg-red-100" : "text-gray-700 bg-gray-100"
            )}>
              {trend > 0 && '+'}{trend}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          <p className={cn("text-2xl font-bold", valueClass)}>{value}</p>
          {secondaryValue && (
            <p className="text-sm text-gray-500">{secondaryValue}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
