
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { listWhatsAppGroups } from '@/services/whatsAppGroupsService';

const TOUR_SESSION_KEY = 'onboarding_tour_shown';

export const useOnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const location = useLocation();
  const tourCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);

  // Verificar se o tour deve ser exibido
  const checkTourConditions = async () => {
    // Evitar múltiplas verificações simultâneas
    if (isCheckingRef.current) {
      console.log('🔍 [TOUR] Verificação já em andamento, pulando...');
      return;
    }

    isCheckingRef.current = true;

    try {
      console.log('🔍 [TOUR] Iniciando verificação de condições do tour...');
      
      // Só mostrar o tour na página inicial (dashboard)
      if (location.pathname !== '/') {
        console.log('❌ [TOUR] Tour só aparece no dashboard, página atual:', location.pathname);
        setShouldShowTour(false);
        isCheckingRef.current = false;
        return;
      }

      // Verificar se existe email no localStorage
      const userEmail = localStorage.getItem('userEmail');
      console.log('📧 [TOUR] Email do usuário para verificação:', userEmail);
      
      if (!userEmail) {
        console.log('❌ [TOUR] Email não encontrado no localStorage');
        setShouldShowTour(false);
        isCheckingRef.current = false;
        return;
      }

      // Verificar se já foi mostrado nesta sessão
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      if (shownThisSession) {
        console.log('❌ [TOUR] Tour já foi exibido nesta sessão');
        setShouldShowTour(false);
        isCheckingRef.current = false;
        return;
      }

      // Verificar se há grupos cadastrados
      let hasGroups = false;
      
      try {
        console.log('🔍 [TOUR] Buscando grupos para o usuário...');
        const groups = await listWhatsAppGroups();
        hasGroups = groups.length > 0;
        console.log('👥 [TOUR] Grupos encontrados:', {
          quantidade: groups.length,
          grupos: groups.map(g => ({ id: g.id, nome: g.nome_grupo, status: g.status, login: g.login }))
        });
      } catch (error) {
        console.log('⚠️ [TOUR] Erro ao verificar grupos, assumindo que não há grupos:', error);
        hasGroups = false;
      }

      // Se tem grupos, não mostrar tour
      if (hasGroups) {
        console.log('✅ [TOUR] Usuário já tem grupos, não mostrar tour');
        setShouldShowTour(false);
        isCheckingRef.current = false;
        return;
      }

      // Tour deve aparecer: usuário sem grupos e tour não foi exibido ainda
      console.log('🎯 [TOUR] CONDIÇÕES ATENDIDAS - Usuário sem grupos e tour não exibido ainda');
      setShouldShowTour(true);
      
      // Abrir tour automaticamente após um pequeno delay
      console.log('🚀 [TOUR] Abrindo tour automaticamente - usuário sem grupos');
      setTimeout(() => {
        if (!sessionStorage.getItem(TOUR_SESSION_KEY)) {
          console.log('🎬 [TOUR] Executando abertura do tour...');
          setIsOpen(true);
          setCurrentStep(0);
          sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ [TOUR] Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    } finally {
      isCheckingRef.current = false;
    }
  };

  // Função para limpar o tour (para quando o usuário cria um grupo)
  const resetTourForNewGroups = () => {
    console.log('🔄 [TOUR] Resetando tour - usuário criou grupos');
    setIsOpen(false);
    setShouldShowTour(false);
    sessionStorage.removeItem(TOUR_SESSION_KEY);
    tourCheckedRef.current = false;
  };

  // Verificar condições quando a localização mudar ou na inicialização
  useEffect(() => {
    if (!tourCheckedRef.current && location.pathname === '/') {
      console.log('🔄 [TOUR] useEffect disparado - verificando condições do tour');
      tourCheckedRef.current = true;
      const timer = setTimeout(() => {
        checkTourConditions();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Escutar evento customizado de login
  useEffect(() => {
    const handleUserLoggedIn = (event: CustomEvent) => {
      console.log('🎉 [TOUR] Evento de login recebido:', event.detail);
      if (location.pathname === '/') {
        console.log('📧 [TOUR] Login detectado no dashboard, re-verificando condições do tour');
        tourCheckedRef.current = false;
        sessionStorage.removeItem(TOUR_SESSION_KEY);
        setTimeout(() => {
          checkTourConditions();
        }, 2500);
      }
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
    };
  }, [location.pathname]);

  const nextStep = () => {
    console.log('➡️ [TOUR] Próximo step do tour:', currentStep + 1);
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  const skipTour = () => {
    console.log('⏭️ [TOUR] Pulando tour');
    closeTour();
  };

  const closeTour = () => {
    console.log('❌ [TOUR] Fechando tour');
    setIsOpen(false);
    setCurrentStep(0);
    setShouldShowTour(false);
    sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
  };

  // Função para forçar reabrir o tour (para testes)
  const reopenTour = () => {
    console.log('🔄 [TOUR] Reabrindo tour manualmente');
    sessionStorage.removeItem(TOUR_SESSION_KEY);
    tourCheckedRef.current = false;
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
    resetTourForNewGroups,
    setCurrentStep
  };
};
