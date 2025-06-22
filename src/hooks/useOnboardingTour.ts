
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
      
      if (shownThisSession) {
        console.log('Tour já foi exibido nesta sessão');
        setShouldShowTour(false);
        setTourShownThisSession(true);
        return;
      }

      // Verificar se há instâncias conectadas
      const hasConnectedInstance = instances.some(instance => 
        instance.status === 'connected' || instance.connectionState === 'open'
      );

      // Verificar se há grupos cadastrados
      const groups = await listWhatsAppGroups();
      const hasGroups = groups.length > 0;

      // Tour deve aparecer se NÃO tiver instância OU NÃO tiver grupos
      const shouldShow = !hasConnectedInstance || !hasGroups;
      
      console.log('Tour conditions:', {
        hasConnectedInstance,
        hasGroups,
        shouldShow,
        instances: instances.length,
        shownThisSession
      });

      setShouldShowTour(shouldShow);
      
      // Se deve mostrar o tour e não foi mostrado ainda, abrir automaticamente
      if (shouldShow && !shownThisSession && !isOpen) {
        setIsOpen(true);
        setCurrentStep(0);
        setTourShownThisSession(true);
        sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
      } else if (!shouldShow) {
        // Se as condições foram atendidas, fechar o tour
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    }
  };

  // Verificar condições quando instâncias mudarem
  useEffect(() => {
    if (instances.length >= 0) { // Verificar mesmo quando não há instâncias
      checkTourConditions();
    }
  }, [instances]);

  // Verificar condições na inicialização
  useEffect(() => {
    checkTourConditions();
  }, []);

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  const skipTour = () => {
    closeTour();
  };

  const closeTour = () => {
    setIsOpen(false);
    setCurrentStep(0);
    // Marcar como exibido nesta sessão
    sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
    setTourShownThisSession(true);
  };

  return {
    isOpen,
    currentStep,
    shouldShowTour,
    nextStep,
    skipTour,
    closeTour,
    setCurrentStep
  };
};
