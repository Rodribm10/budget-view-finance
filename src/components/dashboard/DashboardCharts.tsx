
import React from 'react';
import { CategorySummary, MonthlyData } from "@/types/financialTypes";
import CategoryChart from "@/components/dashboard/CategoryChart";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import { SimpleCard } from "@/components/ui/simple-card";

interface DashboardChartsProps {
  monthlyData: MonthlyData[];
  categories: CategorySummary[];
  isLoading: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ monthlyData, categories, isLoading }) => {
  return (
    <div className="space-y-6">
      {/* 1. Receitas vs Despesas Chart */}
      <SimpleCard title="📈 Receitas vs Despesas" className="border-green-200">
        <MonthlyChart data={monthlyData} isLoading={isLoading} />
      </SimpleCard>

      {/* 2. Gastos por Categoria */}
      <SimpleCard title="📊 Despesas por Categoria" className="border-orange-200">
        <CategoryChart categories={categories} isLoading={isLoading} />
      </SimpleCard>
    </div>
  );
};

export default DashboardCharts;
