
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { listWhatsAppGroups } from '@/services/whatsAppGroupsService';

const TOUR_SESSION_KEY = 'onboarding_tour_shown';

export const useOnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [tourShownThisSession, setTourShownThisSession] = useState(false);
  const location = useLocation();

  // Verificar se o tour deve ser exibido
  const checkTourConditions = async () => {
    try {
      // Só mostrar o tour na página inicial (dashboard)
      if (location.pathname !== '/') {
        console.log('❌ Tour só aparece no dashboard, página atual:', location.pathname);
        setShouldShowTour(false);
        return;
      }

      // Verificar se já foi mostrado nesta sessão
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      
      console.log('🔍 Verificando condições do tour:', {
        shownThisSession,
        location: location.pathname
      });

      if (shownThisSession) {
        console.log('❌ Tour já foi exibido nesta sessão');
        setShouldShowTour(false);
        setTourShownThisSession(true);
        return;
      }

      // Verificar se há grupos cadastrados
      let hasGroups = false;
      const userEmail = localStorage.getItem('userEmail');
      
      console.log('📧 Email do usuário para verificação:', userEmail);
      
      if (!userEmail) {
        console.log('❌ Email não encontrado no localStorage');
        setShouldShowTour(false);
        return;
      }

      try {
        console.log('🔍 Buscando grupos para o usuário...');
        const groups = await listWhatsAppGroups();
        hasGroups = groups.length > 0;
        console.log('👥 Grupos encontrados:', {
          quantidade: groups.length,
          grupos: groups.map(g => ({ id: g.id, nome: g.nome_grupo, status: g.status }))
        });
      } catch (error) {
        console.log('⚠️ Erro ao verificar grupos, assumindo que não há grupos:', error);
        hasGroups = false;
      }

      // Tour deve aparecer se NÃO tiver grupos
      const shouldShow = !hasGroups;
      
      console.log('🎯 Resultado final da verificação:', {
        hasGroups,
        shouldShow,
        currentPath: location.pathname,
        userEmail: userEmail
      });

      setShouldShowTour(shouldShow);
      
      // Se deve mostrar o tour e não foi mostrado ainda, abrir automaticamente
      if (shouldShow && !shownThisSession && !isOpen) {
        console.log('🚀 Abrindo tour automaticamente - usuário sem grupos');
        setTimeout(() => {
          setIsOpen(true);
          setCurrentStep(0);
          setTourShownThisSession(true);
          sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
        }, 1000); // Delay para garantir que a página carregou completamente
      } else if (!shouldShow) {
        console.log('✅ Usuário já tem grupos, não mostrar tour');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    }
  };

  // Verificar condições quando a localização mudar ou na inicialização
  useEffect(() => {
    console.log('🔄 useEffect disparado - verificando condições do tour');
    // Aguardar um pouco para garantir que os dados do usuário estão disponíveis
    const timer = setTimeout(() => {
      checkTourConditions();
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Verificar também quando o email do usuário estiver disponível
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && location.pathname === '/') {
      console.log('📧 Email detectado, re-verificando condições do tour');
      checkTourConditions();
    }
  }, []);

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
