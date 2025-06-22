
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onClose: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  currentStep,
  onNext,
  onSkip,
  onClose
}) => {
  // Cleanup de estilos quando o componente for desmontado ou tour fechado
  useEffect(() => {
    if (!isOpen) {
      removeHighlightStyle();
    }
    
    return () => {
      removeHighlightStyle();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Passo 1 - Conecte seu WhatsApp",
      content: (
        <>
          <p className="mb-4">
            Para que o app funcione, você precisa integrar seu WhatsApp com nossa plataforma.
          </p>
          <p className="mb-4">
            Isso permitirá que suas transações feitas no WhatsApp apareçam automaticamente aqui no Finance Home.
          </p>
          <p className="font-semibold text-blue-600">
            👉 Clique em "Conectar WhatsApp", digite o código da cidade + seu número de WhatsApp e depois clique em "Criar Instância".
          </p>
        </>
      ),
      spotlight: 'whatsapp-menu'
    },
    {
      title: "Passo 2 - Crie seu Grupo com a IA",
      content: (
        <>
          <p className="mb-4">
            Agora você precisa criar um grupo no WhatsApp com o nosso bot de IA chamado Angelina.
          </p>
          <p className="mb-4">
            Nele, você vai mandar mensagens, áudios ou comprovantes, e o sistema vai registrar automaticamente suas despesas e receitas.
          </p>
          <p className="font-semibold text-blue-600">
            👉 Clique em "Grupos", escolha o nome do grupo e clique em "Cadastrar Grupo".
          </p>
        </>
      ),
      spotlight: 'grupos-menu'
    },
    {
      title: "Pronto! 🚀",
      content: (
        <>
          <p className="text-lg mb-4">
            Agora você pode começar a usar o Finance Home de forma automática.
          </p>
          <p className="text-base">
            Tudo que você enviar para o grupo vai ser registrado no app.
          </p>
        </>
      ),
      spotlight: null
    }
  ];

  const currentStepData = steps[currentStep];

  // Remover estilos quando não há spotlight
  const removeHighlightStyle = () => {
    const elements = document.querySelectorAll('[data-tour]') as NodeListOf<HTMLElement>;
    elements.forEach(element => {
      element.style.backgroundColor = '';
      element.style.color = '';
      element.style.fontWeight = '';
      element.style.boxShadow = '';
      element.style.border = '';
      element.style.borderRadius = '';
      element.style.position = '';
      element.style.zIndex = '';
    });
  };

  // Estilo para destacar o elemento com fundo branco e texto preto
  const highlightElementStyle = () => {
    if (!currentStepData.spotlight) return;

    const element = document.querySelector(`[data-tour="${currentStepData.spotlight}"]`) as HTMLElement;
    if (!element) return;

    // Aplicar estilos diretamente no elemento
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.style.fontWeight = '600';
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
    element.style.border = '2px solid rgba(59, 130, 246, 0.8)';
    element.style.borderRadius = '8px';
    element.style.position = 'relative';
    element.style.zIndex = '9999';
  };

  // Aplicar ou remover highlight baseado no step atual
  useEffect(() => {
    if (currentStepData.spotlight) {
      // Primeiro remover qualquer highlight anterior
      removeHighlightStyle();
      // Pequeno delay para garantir que o DOM foi renderizado
      setTimeout(() => {
        highlightElementStyle();
      }, 100);
    } else {
      removeHighlightStyle();
    }
  }, [currentStep, currentStepData.spotlight]);

  const getSpotlightStyle = () => {
    if (!currentStepData.spotlight) return {};

    const element = document.querySelector(`[data-tour="${currentStepData.spotlight}"]`);
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    return {
      position: 'absolute' as const,
      left: rect.left - 10,
      top: rect.top - 10,
      width: rect.width + 20,
      height: rect.height + 20,
      borderRadius: '8px',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 1), inset 0 0 0 3px rgba(59, 130, 246, 0.8)',
      pointerEvents: 'none' as const,
      zIndex: 9998,
      border: '2px solid rgba(59, 130, 246, 0.9)'
    };
  };

  const getArrowStyle = () => {
    if (!currentStepData.spotlight) return { display: 'none' };

    const element = document.querySelector(`[data-tour="${currentStepData.spotlight}"]`);
    const card = document.querySelector('.onboarding-card');
    
    if (!element || !card) return { display: 'none' };

    const elementRect = element.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Calcular posição da seta
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    // Calcular ângulo e distância
    const deltaX = elementCenterX - cardCenterX;
    const deltaY = elementCenterY - cardCenterY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Posicionar a seta no meio do caminho
    const arrowX = cardCenterX + (deltaX * 0.6);
    const arrowY = cardCenterY + (deltaY * 0.6);

    return {
      position: 'fixed' as const,
      left: arrowX,
      top: arrowY,
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      zIndex: 9999,
      pointerEvents: 'none' as const,
      width: '60px',
      height: '3px',
      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)',
      borderRadius: '2px',
      filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
    };
  };

  const getArrowHeadStyle = () => {
    if (!currentStepData.spotlight) return { display: 'none' };

    const element = document.querySelector(`[data-tour="${currentStepData.spotlight}"]`);
    const card = document.querySelector('.onboarding-card');
    
    if (!element || !card) return { display: 'none' };

    const elementRect = element.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const deltaX = elementCenterX - cardCenterX;
    const deltaY = elementCenterY - cardCenterY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Posicionar a ponta da seta mais próxima do elemento
    const arrowHeadX = cardCenterX + (deltaX * 0.75);
    const arrowHeadY = cardCenterY + (deltaY * 0.75);

    return {
      position: 'fixed' as const,
      left: arrowHeadX,
      top: arrowHeadY,
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      zIndex: 9999,
      pointerEvents: 'none' as const,
      width: '0',
      height: '0',
      borderLeft: '8px solid rgba(59, 130, 246, 0.8)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
    };
  };

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 z-[9997]"
        style={{ zIndex: 9997 }}
      />
      
      {/* Spotlight transparente */}
      {currentStepData.spotlight && (
        <div style={getSpotlightStyle()} />
      )}

      {/* Seta moderna conectando o card ao elemento */}
      {currentStepData.spotlight && (
        <>
          <div style={getArrowStyle()} />
          <div style={getArrowHeadStyle()} />
        </>
      )}
      
      {/* Card do tour */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <Card className="onboarding-card w-full max-w-md bg-white shadow-2xl border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {currentStepData.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-gray-600 mb-6">
              {currentStepData.content}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={onSkip}
                  className="hover:bg-gray-100 transition-colors font-semibold"
                >
                  Pular Tour
                </Button>
                <Button 
                  onClick={onNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 transition-colors shadow-lg"
                >
                  {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OnboardingTour;
