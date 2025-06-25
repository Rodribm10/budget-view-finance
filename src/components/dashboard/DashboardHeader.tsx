
import React from 'react';

const DashboardHeader = () => {
  const getCurrentMonthYear = () => {
    const now = new Date();
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${month} ${year}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
        <p className="text-gray-600 mt-1">Dados de: {getCurrentMonthYear()}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
