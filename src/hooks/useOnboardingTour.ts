
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { listWhatsAppGroups } from '@/services/whatsAppGroupsService';

const TOUR_SESSION_KEY = 'onboarding_tour_shown';

export const useOnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [tourShownThisSession, setTourShownThisSession] = useState(false);
  const [isCheckingConditions, setIsCheckingConditions] = useState(false);
  const location = useLocation();

  // Verificar se o tour deve ser exibido
  const checkTourConditions = async () => {
    // Evitar múltiplas verificações simultâneas
    if (isCheckingConditions) {
      console.log('🔄 [TOUR] Verificação já em andamento, ignorando...');
      return;
    }

    try {
      setIsCheckingConditions(true);
      console.log('🔍 [TOUR] Iniciando verificação de condições do tour...');
      
      // Só mostrar o tour na página inicial (dashboard)
      if (location.pathname !== '/') {
        console.log('❌ [TOUR] Tour só aparece no dashboard, página atual:', location.pathname);
        setShouldShowTour(false);
        return;
      }

      // Se tour já está aberto, não verificar novamente
      if (isOpen) {
        console.log('🚫 [TOUR] Tour já está aberto, ignorando verificação');
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

      // SEMPRE verificar se há grupos cadastrados
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
      console.log('🔍 [TOUR] Usuário SEM grupos. Tour já exibido nesta sessão:', shownThisSession);

      if (shownThisSession) {
        console.log('❌ [TOUR] Tour já foi exibido nesta sessão');
        setShouldShowTour(false);
        setTourShownThisSession(true);
        return;
      }

      // Tour deve aparecer: usuário sem grupos e tour não foi exibido ainda
      console.log('🎯 [TOUR] CONDIÇÕES ATENDIDAS - Usuário sem grupos e tour não exibido ainda');
      setShouldShowTour(true);
      
      // Abrir tour automaticamente após um pequeno delay, mas apenas se não estiver já aberto
      if (!isOpen) {
        console.log('🚀 [TOUR] Abrindo tour automaticamente - usuário sem grupos');
        setTimeout(() => {
          // Verificar novamente se não foi aberto enquanto esperava
          setIsOpen(prevIsOpen => {
            if (!prevIsOpen) {
              console.log('🎬 [TOUR] Executando abertura do tour...');
              setCurrentStep(0);
              // Marcar como exibido quando realmente abrir
              sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
              setTourShownThisSession(true);
              return true;
            } else {
              console.log('🚫 [TOUR] Tour já estava aberto, não abrindo novamente');
              return prevIsOpen;
            }
          });
        }, 1500);
      }

    } catch (error) {
      console.error('❌ [TOUR] Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    } finally {
      setIsCheckingConditions(false);
    }
  };

  // Função para limpar o tour (para quando o usuário cria um grupo)
  const resetTourForNewGroups = () => {
    console.log('🔄 [TOUR] Resetando tour - usuário criou grupos');
    setIsOpen(false);
    setShouldShowTour(false);
    sessionStorage.removeItem(TOUR_SESSION_KEY);
    setTourShownThisSession(false);
    setCurrentStep(0);
  };

  // Verificar condições quando a localização mudar ou na inicialização
  useEffect(() => {
    console.log('🔄 [TOUR] useEffect disparado - verificando condições do tour');
    const timer = setTimeout(() => {
      checkTourConditions();
    }, 1000);

    return () => {
      clearTimeout(timer);
      setIsCheckingConditions(false);
    };
  }, [location.pathname]);

  // Escutar evento customizado de login
  useEffect(() => {
    const handleUserLoggedIn = (event: CustomEvent) => {
      console.log('🎉 [TOUR] Evento de login recebido:', event.detail);
      if (location.pathname === '/' && !isOpen) {
        console.log('📧 [TOUR] Login detectado no dashboard, re-verificando condições do tour');
        // Limpar sessionStorage para nova verificação após login
        sessionStorage.removeItem(TOUR_SESSION_KEY);
        setTourShownThisSession(false);
        setTimeout(() => {
          checkTourConditions();
        }, 2000);
      }
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn as EventListener);
    };
  }, [location.pathname, isOpen]);

  // Verificar também quando o email do usuário estiver disponível
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    console.log('📧 [TOUR] Segundo useEffect - email disponível:', userEmail);
    if (userEmail && location.pathname === '/' && !isOpen && !tourShownThisSession) {
      console.log('📧 [TOUR] Email detectado, re-verificando condições do tour');
      setTimeout(() => {
        checkTourConditions();
      }, 1500);
    }
  }, []);

  // Escutar mudanças no localStorage para detectar login
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail' && e.newValue && !isOpen) {
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
  }, [location.pathname, isOpen]);

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
    // Garantir que está marcado como exibido
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
