
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategorySummary } from '@/types/financialTypes';

interface CategoryChartProps {
  categories: CategorySummary[];
  isLoading?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ categories, isLoading = false }) => {
  const validCategories = categories.filter(cat => cat.valor > 0);

  // Enhanced color palette with more distinct colors
  const enhancedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A3E4D7', '#FAD7A0', '#D5A6BD', '#AED6F1', '#A9DFBF'
  ];

  // Assign colors to categories, ensuring no white or very light colors
  const categoriesWithColors = validCategories.map((category, index) => ({
    ...category,
    color: enhancedColors[index % enhancedColors.length]
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-4 h-4 mr-3 rounded-full shadow-sm border border-gray-200"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate font-medium text-zinc-700 dark:text-white">
              {entry.value} ({(entry.payload.percentage * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl shadow-lg transition-all duration-300">
          <p className="font-semibold text-base text-zinc-800 dark:text-white mb-2">{payload[0].name}</p>
          <p className="font-bold text-lg text-blue-600">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {`${(payload[0].payload.percentage * 100).toFixed(1)}% do total`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full animate-fade-in">
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="h-32 w-32 rounded-full border-4 border-t-primary border-opacity-20 animate-spin" />
        </div>
      ) : categoriesWithColors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <span>Sem dados disponíveis</span>
          <span className="text-xs mt-2">Verifique se existem transações do tipo 'despesa' cadastradas</span>
        </div>
      ) : (
        <div className="h-[400px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoriesWithColors}
                cx="50%"
                cy="40%"
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="valor"
                nameKey="categoria"
                paddingAngle={1}
                strokeWidth={2}
                stroke="#fff"
                isAnimationActive={true}
                animationDuration={1500}
              >
                {categoriesWithColors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ 
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                      stroke: '#ffffff',
                      strokeWidth: 2
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
              <Legend 
                content={renderCustomLegend} 
                layout="horizontal" 
                verticalAlign="bottom" 
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
