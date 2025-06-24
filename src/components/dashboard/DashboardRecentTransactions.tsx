
import React from 'react';
import { Transaction } from '@/types/financialTypes';
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { SimpleCard } from "@/components/ui/simple-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface DashboardRecentTransactionsProps {
  transactions: Transaction[];
  transactionsLoading: boolean;
}

const DashboardRecentTransactions: React.FC<DashboardRecentTransactionsProps> = ({ 
  transactions, 
  transactionsLoading 
}) => {
  const navigate = useNavigate();

  return (
    <SimpleCard title="📋 Últimas Transações" className="border-blue-200">
      <div className="space-y-4">
        <TransactionsTable 
          transactions={transactions.slice(0, 5)} 
          isLoading={transactionsLoading}
          showPagination={false}
          onEdit={() => {}}
          onDelete={() => {}}
        />
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/transacoes')}
            className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            Ver todas as transações
          </Button>
        </div>
      </div>
    </SimpleCard>
  );
};

export default DashboardRecentTransactions;
