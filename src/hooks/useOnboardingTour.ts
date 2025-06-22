
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

      // Verificar se já foi mostrado nesta sessão
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      
      console.log('🔍 [TOUR] Verificando condições:', {
        shownThisSession,
        location: location.pathname,
        sessionStorage: sessionStorage.getItem(TOUR_SESSION_KEY)
      });

      if (shownThisSession) {
        console.log('❌ [TOUR] Tour já foi exibido nesta sessão');
        setShouldShowTour(false);
        setTourShownThisSession(true);
        return;
      }

      // Verificar se há grupos cadastrados
      let hasGroups = false;
      const userEmail = localStorage.getItem('userEmail');
      
      console.log('📧 [TOUR] Email do usuário para verificação:', userEmail);
      
      if (!userEmail) {
        console.log('❌ [TOUR] Email não encontrado no localStorage');
        setShouldShowTour(false);
        return;
      }

      try {
        console.log('🔍 [TOUR] Buscando grupos para o usuário...');
        const groups = await listWhatsAppGroups();
        hasGroups = groups.length > 0;
        console.log('👥 [TOUR] Grupos encontrados:', {
          quantidade: groups.length,
          grupos: groups.map(g => ({ id: g.id, nome: g.nome_grupo, status: g.status, login: g.login }))
        });
        console.log('📊 [TOUR] Query resultado completo:', groups);
      } catch (error) {
        console.log('⚠️ [TOUR] Erro ao verificar grupos, assumindo que não há grupos:', error);
        hasGroups = false;
      }

      // Tour deve aparecer se NÃO tiver grupos
      const shouldShow = !hasGroups;
      
      console.log('🎯 [TOUR] Resultado final da verificação:', {
        hasGroups,
        shouldShow,
        currentPath: location.pathname,
        userEmail: userEmail,
        shownThisSession
      });

      setShouldShowTour(shouldShow);
      
      // Se deve mostrar o tour e não foi mostrado ainda, abrir automaticamente
      if (shouldShow && !shownThisSession && !isOpen) {
        console.log('🚀 [TOUR] Abrindo tour automaticamente - usuário sem grupos');
        setTimeout(() => {
          console.log('🎬 [TOUR] Executando abertura do tour...');
          setIsOpen(true);
          setCurrentStep(0);
          setTourShownThisSession(true);
          sessionStorage.setItem(TOUR_SESSION_KEY, 'true');
        }, 2000); // Delay para garantir que tudo carregue
      } else if (!shouldShow) {
        console.log('✅ [TOUR] Usuário já tem grupos, não mostrar tour');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('❌ [TOUR] Erro ao verificar condições do tour:', error);
      setShouldShowTour(false);
    }
  };

  // Verificar condições quando a localização mudar ou na inicialização
  useEffect(() => {
    console.log('🔄 [TOUR] useEffect disparado - verificando condições do tour');
    // Aguardar um pouco para garantir que os dados do usuário estão disponíveis
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
        console.log('📧 [TOUR] Login detectado no dashboard, verificando condições do tour');
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
      // Delay maior para garantir que o usuário já está logado completamente
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
          setTimeout(() => {
            checkTourConditions();
          }, 2000);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  // Limpar tour ao mudar de sessão
  useEffect(() => {
    const handleSessionStorageChange = () => {
      const shownThisSession = sessionStorage.getItem(TOUR_SESSION_KEY) === 'true';
      setTourShownThisSession(shownThisSession);
    };

    window.addEventListener('storage', handleSessionStorageChange);
    return () => window.removeEventListener('storage', handleSessionStorageChange);
  }, []);

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
    // Marcar como exibido nesta sessão
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
    setCurrentStep
  };
};
