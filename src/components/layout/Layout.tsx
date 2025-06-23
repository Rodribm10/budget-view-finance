
import NewModernLayout from './NewModernLayout';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import HelpIcon from '@/components/help/HelpIcon';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';

interface LayoutProps {
  children: React.ReactNode;
  useModernSidebar?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  const {
    isOpen: tourOpen,
    currentStep,
    nextStep,
    skipTour,
    closeTour
  } = useOnboardingTour();

  // Sempre usa o novo layout moderno
  return <NewModernLayout>{children}</NewModernLayout>;
}
