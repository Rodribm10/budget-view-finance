
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from 'lucide-react';

interface MonthFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  className?: string;
}

export const MonthFilter = ({ selectedMonth, onMonthChange, className }: MonthFilterProps) => {
  const months = [
    { value: '2024-01', label: 'Janeiro 2024' },
    { value: '2024-02', label: 'Fevereiro 2024' },
    { value: '2024-03', label: 'Março 2024' },
    { value: '2024-04', label: 'Abril 2024' },
    { value: '2024-05', label: 'Maio 2024' },
    { value: '2024-06', label: 'Junho 2024' },
    { value: '2024-07', label: 'Julho 2024' },
    { value: '2024-08', label: 'Agosto 2024' },
    { value: '2024-09', label: 'Setembro 2024' },
    { value: '2024-10', label: 'Outubro 2024' },
    { value: '2024-11', label: 'Novembro 2024' },
    { value: '2024-12', label: 'Dezembro 2024' },
    { value: '2025-01', label: 'Janeiro 2025' },
    { value: '2025-02', label: 'Fevereiro 2025' },
    { value: '2025-03', label: 'Março 2025' },
    { value: '2025-04', label: 'Abril 2025' },
    { value: '2025-05', label: 'Maio 2025' },
    { value: '2025-06', label: 'Junho 2025' },
    { value: '2025-07', label: 'Julho 2025' },
    { value: '2025-08', label: 'Agosto 2025' },
    { value: '2025-09', label: 'Setembro 2025' },
    { value: '2025-10', label: 'Outubro 2025' },
    { value: '2025-11', label: 'Novembro 2025' },
    { value: '2025-12', label: 'Dezembro 2025' },
  ];

  // Função para obter o mês atual no formato YYYY-MM
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
