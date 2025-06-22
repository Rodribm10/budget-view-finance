
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { listWhatsAppGroups } from '@/services/whatsAppGroupsService';

const TOUR_SESSION_KEY = 'onboarding_tour_shown';

export const useOnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [tourShownThisSession, setTourShownThisSession] = useState(false);
  const location = useLocation();
  const { instances } = useWhatsAppInstances();

  // Verificar se o tour deve ser exibido
  const checkTourConditions = async () => {
    try {
      // Verificar se já foi mostrado nesta sessão
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      
      console.log('🔍 Verificando condições do tour:', {
        shownThisSession,
        instances: instances.length,
        location: location.pathname
      });

      if (shownThisSession) {
        console.log('❌ Tour já foi exibido nesta sessão');
        setShouldShowTour(false);
        setTourShownThisSession(true);
        return;
      }

      // Verificar se há instâncias conectadas
      const hasConnectedInstance = instances.some(instance => 
        instance.status === 'connected' || instance.connectionState === 'open'
      );

      console.log('📱 Status das instâncias:', {
        totalInstances: instances.length,
        hasConnectedInstance,
        instancesDetails: instances.map(i => ({ 
          name: i.instanceName, 
          status: i.status, 
          connectionState: i.connectionState 
        }))
      });

      // Verificar se há grupos cadastrados
      let hasGroups = false;
      try {
        const groups = await listWhatsAppGroups();
        hasGroups = groups.length > 0;
        console.log('👥 Grupos encontrados:', groups.length);
      } catch (error) {
        console.log('⚠️ Erro ao verificar grupos, assumindo que não há grupos:', error);
        hasGroups = false;
      }

      // Tour deve aparecer se NÃO tiver instância conectada OU NÃO tiver grupos
      const shouldShow = !hasConnectedInstance || !hasGroups;
      
      console.log('🎯 Resultado da verificação:', {
        hasConnectedInstance,
        hasGroups,
        shouldShow,
        currentPath: location.pathname
      });

      setShouldShowTour(shouldShow);
      
      // Se deve mostrar o tour e não foi mostrado ainda, abrir automaticamente
      if (shouldShow && !shownThisSession && !isOpen) {
        console.log('🚀 Abrindo tour automaticamente');
        setIsOpen(true);
        setCurrentStep(0);
        setTourShownThisSession(true);
        sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
      } else if (!shouldShow) {
        // Se as condições foram atendidas, fechar o tour
        console.log('✅ Condições atendidas, fechando tour se estiver aberto');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    }
  };

  // Verificar condições quando instâncias mudarem ou na inicialização
  useEffect(() => {
    console.log('🔄 Efeito disparado - verificando condições do tour');
    checkTourConditions();
  }, [instances, location.pathname]);

  // Limpar tour ao mudar de sessão
  useEffect(() => {
    const handleStorageChange = () => {
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      setTourShownThisSession(shownThisSession);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const nextStep = () => {
    console.log('➡️ Próximo step do tour:', currentStep + 1);
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  const skipTour = () => {
    console.log('⏭️ Pulando tour');
    closeTour();
  };

  const closeTour = () => {
    console.log('❌ Fechando tour');
    setIsOpen(false);
    setCurrentStep(0);
    // Marcar como exibido nesta sessão
    sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
    setTourShownThisSession(true);
  };

  // Função para forçar reabrir o tour (para testes)
  const reopenTour = () => {
    console.log('🔄 Reabrindo tour manualmente');
    sessionStorage.removeItem(TOUR_SESSION_KEY);
    setTourShownThisSession(false);
    setIsOpen(true);
    setCurrentStep(0);
  };

  return {
    isOpen,
    currentStep,
    shouldShowTour,
    nextStep,
    skipTour,
    closeTour,
    reopenTour,
    setCurrentStep
  };
};
