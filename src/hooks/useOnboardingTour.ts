
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { listWhatsAppGroups } from '@/services/whatsAppGroupsService';

export const useOnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const location = useLocation();
  const { instances } = useWhatsAppInstances();

  // Verificar se o tour deve ser exibido
  const checkTourConditions = async () => {
    try {
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
        instances: instances.length
      });

      setShouldShowTour(shouldShow);
      
      // Se deve mostrar o tour e não está aberto, abrir automaticamente
      if (shouldShow && !isOpen) {
        setIsOpen(true);
        setCurrentStep(0);
      } else if (!shouldShow && isOpen) {
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

  // Verificar condições periodicamente
  useEffect(() => {
    const interval = setInterval(checkTourConditions, 5000); // A cada 5 segundos
    return () => clearInterval(interval);
  }, [instances]);

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
