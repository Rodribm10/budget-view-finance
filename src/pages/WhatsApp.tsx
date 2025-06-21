
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
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  
  // State para controlar se deve mostrar o formulário de criação
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hasValidInstance, setHasValidInstance] = useState(false);
  const [checkingUserInstance, setCheckingUserInstance] = useState(true);
  
  const userEmail = localStorage.getItem('userEmail') || '';

  // Verificar se o usuário tem instância válida no banco de dados
  useEffect(() => {
    const checkUserInstanceFromDB = async () => {
      if (!userEmail) {
        setCheckingUserInstance(false);
        setShowCreateForm(true);
        return;
      }

      try {
        console.log('🔍 Verificando instância do usuário no banco:', userEmail);
        const instanceData = await getUserWhatsAppInstance(userEmail);
        
        const hasInstance = !!(
          instanceData && 
          instanceData.instancia_zap && 
          instanceData.instancia_zap.trim() !== '' &&
          instanceData.instancia_zap !== 'null' &&
          instanceData.instancia_zap !== null
        );
        
        console.log('📋 Usuário tem instância válida:', hasInstance, instanceData);
        
        setHasValidInstance(hasInstance);
        setShowCreateForm(!hasInstance);
        
        if (hasInstance) {
          setInstanceFound(true);
        }
        
      } catch (error) {
        console.error('❌ Erro ao verificar instância do usuário:', error);
        setHasValidInstance(false);
        setShowCreateForm(true);
      } finally {
        setCheckingUserInstance(false);
      }
    };

    checkUserInstanceFromDB();
  }, [userEmail, setInstanceFound]);
  
  // Set up periodic status checking only after instances are loaded
  usePeriodicStatusCheck(instances.length, checkAllInstancesStatus);

  // Handler para quando o usuário cria uma nova instância
  const handleInstanceCreated = (newInstance: WhatsAppInstance) => {
    console.log('🎉 Nova instância criada:', newInstance);
    addInstance(newInstance);
    setInstanceFound(true);
    setHasValidInstance(true);
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
      
      // Se a instância excluída for a atual, limpar o nome salvo e permitir criação de nova
      if (instanceToDelete.instanceName === instanceName) {
        clearInstanceName();
        setHasValidInstance(false);
        setShowCreateForm(true);
      }
    } else {
      console.error(`❌ Inst ncia com ID ${instanceId} não encontrada para exclusão`);
    }
  };

  // Check if we have any instances to show
  const hasInstances = Array.isArray(instances) && instances.length > 0;

  if (checkingUserInstance || isLoading) {
    return (
      <Layout>
        <LoadingState message="Verificando suas instâncias..." />
      </Layout>
    );
  }

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
        
        {/* Show create form if user doesn't have a valid instance */}
        {showCreateForm && (
          <CreateInstanceForm 
            onInstanceCreated={handleInstanceCreated} 
            initialInstanceName={instanceName}
          />
        )}
        
        {/* Toggle Create Form Button - only show if form is hidden and user has instance */}
        {!showCreateForm && hasValidInstance && (
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
