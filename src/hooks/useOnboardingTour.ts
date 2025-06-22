
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
      console.log('🔍 [TOUR] Iniciando verificação de condições do tour...');
      
      // Só mostrar o tour na página inicial (dashboard)
      if (location.pathname !== '/') {
        console.log('❌ [TOUR] Tour só aparece no dashboard, página atual:', location.pathname);
        setShouldShowTour(false);
        return;
      }

      // Verificar se existe email no localStorage
      const userEmail = localStorage.getItem('userEmail');
      console.log('📧 [TOUR] Email do usuário para verificação:', userEmail);
      
      if (!userEmail) {
        console.log('❌ [TOUR] Email não encontrado no localStorage');
        setShouldShowTour(false);
        return;
      }

      // SEMPRE verificar se há grupos cadastrados (ignorar sessionStorage inicialmente)
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
        setIsOpen(false);
        return;
      }

      // Se não tem grupos, verificar se já foi mostrado nesta sessão
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      console.log('🔍 [TOUR] Usuário SEM grupos. Verificando se tour já foi exibido nesta sessão:', shownThisSession);

      if (shownThisSession) {
        console.log('❌ [TOUR] Tour já foi exibido nesta sessão para este usuário sem grupos');
        setShouldShowTour(false);
        setTourShownThisSession(true);
        return;
      }

      // Tour deve aparecer: usuário sem grupos e tour não foi exibido ainda
      console.log('🎯 [TOUR] CONDIÇÕES ATENDIDAS - Usuário sem grupos e tour não exibido ainda');
      setShouldShowTour(true);
      
      // Abrir tour automaticamente após um pequeno delay
      console.log('🚀 [TOUR] Abrindo tour automaticamente - usuário sem grupos');
      setTimeout(() => {
        console.log('🎬 [TOUR] Executando abertura do tour...');
        setIsOpen(true);
        setCurrentStep(0);
        // SÓ marcar como exibido quando realmente abrir
        sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
        setTourShownThisSession(true);
      }, 2000);

    } catch (error) {
      console.error('❌ [TOUR] Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    }
  };

  // Função para limpar o tour (para quando o usuário cria um grupo)
  const resetTourForNewGroups = () => {
    console.log('🔄 [TOUR] Resetando tour - usuário criou grupos');
    setIsOpen(false);
    setShouldShowTour(false);
    sessionStorage.removeItem(TOUR_SESSION_KEY);
    setTourShownThisSession(false);
  };

  // Verificar condições quando a localização mudar ou na inicialização
  useEffect(() => {
    console.log('🔄 [TOUR] useEffect disparado - verificando condições do tour');
    const timer = setTimeout(() => {
      checkTourConditions();
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Escutar evento customizado de login
  useEffect(() => {
    const handleUserLoggedIn = (event: CustomEvent) => {
      console.log('🎉 [TOUR] Evento de login recebido:', event.detail);
      if (location.pathname === '/') {
        console.log('📧 [TOUR] Login detectado no dashboard, re-verificando condições do tour');
        // Limpar sessionStorage para nova verificação após login
        sessionStorage.removeItem(TOUR_SESSION_KEY);
        setTourShownThisSession(false);
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

  // Verificar também quando o email do usuário estiver disponível
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    console.log('📧 [TOUR] Segundo useEffect - email disponível:', userEmail);
    if (userEmail && location.pathname === '/') {
      console.log('📧 [TOUR] Email detectado, re-verificando condições do tour');
      // Limpar sessionStorage para nova verificação
      sessionStorage.removeItem(TOUR_SESSION_KEY);
      setTourShownThisSession(false);
      setTimeout(() => {
        checkTourConditions();
      }, 1500);
    }
  }, []);

  // Escutar mudanças no localStorage para detectar login
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail' && e.newValue) {
        console.log('👤 [TOUR] Login detectado via storage event:', e.newValue);
        if (location.pathname === '/') {
          // Limpar sessionStorage para nova verificação após mudança de usuário
          sessionStorage.removeItem(TOUR_SESSION_KEY);
          setTourShownThisSession(false);
          setTimeout(() => {
            checkTourConditions();
          }, 2000);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    // Marcar como exibido nesta sessão apenas quando fechar
    sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
    setTourShownThisSession(true);
  };

  // Função para forçar reabrir o tour (para testes)
  const reopenTour = () => {
    console.log('🔄 [TOUR] Reabrindo tour manualmente');
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
    resetTourForNewGroups,
    setCurrentStep
  };
};
