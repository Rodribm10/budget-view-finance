
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import Layout from '@/components/layout/Layout';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import InstanceStats from '@/components/whatsapp/InstanceStats';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';
import LoadingState from '@/components/whatsapp/LoadingState';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';
import { useWhatsAppInstance, WHATSAPP_INSTANCE_KEY } from '@/hooks/whatsApp/useWhatsAppInstance';
import { usePeriodicStatusCheck } from '@/hooks/whatsApp/usePeriodicStatusCheck';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

const WhatsApp = () => {
  const { 
    instances, 
    isRefreshing,
    addInstance, 
    removeInstance, 
    updateInstance, 
    refreshInstances, 
    checkAllInstancesStatus,
    currentUserId
  } = useWhatsAppInstances();

  const {
    activeInstance,
    qrDialogOpen,
    setQrDialogOpen,
    handleRestartInstance,
    handleLogoutInstance,
    handleDisconnectInstance,
    handleSetPresence,
    handleDeleteInstance,
    handleViewQrCode
  } = useWhatsAppActions(updateInstance, removeInstance, checkAllInstancesStatus);
  
  // Custom hook for instance fetching and management
  const {
    instanceName,
    isLoading,
    instanceFound,
    setInstanceFound,
    fetchInstanceByName,
    saveInstanceName,
    clearInstanceName
  } = useWhatsAppInstance(currentUserId, addInstance);
  
  // Toggle for showing the creation form
  const [showCreateForm, setShowCreateForm] = useState(!instanceFound && instances.length === 0);
  
  // Set up periodic status checking only after instances are loaded
  usePeriodicStatusCheck(instances.length, checkAllInstancesStatus);

  // Handler para quando o usuário cria uma nova instância
  const handleInstanceCreated = (newInstance: WhatsAppInstance) => {
    console.log('🎉 Nova instância criada:', newInstance);
    addInstance(newInstance);
    setInstanceFound(true);
    setShowCreateForm(false);
    
    // Salvar o nome da instância no localStorage para uso futuro
    saveInstanceName(newInstance.instanceName);
    
    // If there's a QR code in the response, show it
    if (newInstance.qrcode) {
      handleViewQrCode(newInstance);
    }

    // Trigger a status check for all instances with a delay
    setTimeout(async () => {
      try {
        await checkAllInstancesStatus();
      } catch (error) {
        console.error("Error checking status after instance creation:", error);
      }
    }, 2000);
  };

  // Handler for when an instance is deleted
  const handleDeleteInstanceWrapper = (instanceId: string) => {
    console.log(`🗑️ Solicitação de exclusão da instância ID: ${instanceId}`);
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    if (instanceToDelete) {
      handleDeleteInstance(instanceId, instanceToDelete.instanceName);
      
      // Se a instância excluída for a atual, limpar o nome salvo
      if (instanceToDelete.instanceName === instanceName) {
        clearInstanceName();
        setShowCreateForm(true);
      }
    } else {
      console.error(`❌ Instância com ID ${instanceId} não encontrada para exclusão`);
    }
  };

  // Check if we have any instances to show
  const hasInstances = Array.isArray(instances) && instances.length > 0;
  const userEmail = localStorage.getItem('userEmail') || '';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
            {userEmail && (
              <p className="text-sm text-muted-foreground mt-1">
                Mostrando instâncias para: <strong>{userEmail}</strong>
              </p>
            )}
          </div>
          
          {/* Update List Button - Always visible */}
          <Button 
            variant="outline" 
            onClick={refreshInstances}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar Lista'}
          </Button>
        </div>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Always show create form if showCreateForm is true */}
            {showCreateForm && (
              <CreateInstanceForm 
                onInstanceCreated={handleInstanceCreated} 
                initialInstanceName={instanceName}
              />
            )}
            
            {/* Toggle Create Form Button - only show if form is hidden */}
            {!showCreateForm && (
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="mb-4"
              >
                Conectar Novo WhatsApp
              </Button>
            )}
            
            {/* Only show stats if instances are available */}
            {hasInstances && <InstanceStats instances={instances} />}
            
            {/* List of created instances */}
            <InstanceList 
              instances={instances} 
              onViewQrCode={handleViewQrCode} 
              onDelete={handleDeleteInstanceWrapper}
              onRestart={handleRestartInstance}
              onLogout={handleLogoutInstance}
              onDisconnect={handleDisconnectInstance}
              onSetPresence={handleSetPresence}
              onRefreshInstances={refreshInstances}
              isRefreshing={isRefreshing}
            />
          </>
        )}
        
        {/* QR Code Dialog */}
        <QrCodeDialog 
          open={qrDialogOpen} 
          onOpenChange={setQrDialogOpen}
          activeInstance={activeInstance}
          onStatusCheck={checkAllInstancesStatus}
        />
      </div>
    </Layout>
  );
};

export default WhatsApp;
