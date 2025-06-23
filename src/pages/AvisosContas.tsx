
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Bell, Calendar, Clock } from 'lucide-react';
import ContaRecorrenteForm from '@/components/avisos/ContaRecorrenteForm';
import ContasRecorrentesList from '@/components/avisos/ContasRecorrentesList';

const AvisosContas = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avisos de Contas a Pagar</h1>
          <p className="text-gray-600 mt-2">Gerencie lembretes automáticos para suas contas recorrentes</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Cards informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Como funciona</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Automático</div>
            <p className="text-xs text-muted-foreground">
              Receba lembretes automáticos via WhatsApp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antecedência</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1-30 dias</div>
            <p className="text-xs text-muted-foreground">
              Configure quantos dias antes ser avisado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horário</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Personalizado</div>
            <p className="text-xs text-muted-foreground">
              Escolha o horário ideal para receber avisos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de nova conta */}
      {showForm && (
        <ContaRecorrenteForm 
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
          }}
        />
      )}

      {/* Lista de contas */}
      <ContasRecorrentesList />
    </div>
  );
};

export default AvisosContas;
