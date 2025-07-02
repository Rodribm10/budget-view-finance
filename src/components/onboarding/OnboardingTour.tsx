
import React, { useEffect, useRef } from 'react';
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
  const cleanupRef = useRef<() => void>();

  const steps = [
    {
      title: "Bem-vindo ao Finance Home! 🎉",
      content: (
        <>
          <p className="mb-4">
            Olá! Este é o Finance Home, sua ferramenta para controle financeiro automático.
          </p>
          <p className="mb-4">
            Vamos te ensinar como navegar pelo sistema e usar suas principais funcionalidades.
          </p>
          <p className="font-semibold text-blue-600">
            👉 Use o botão do menu (☰) no canto superior esquerdo para abrir e retrair o menu lateral.
          </p>
        </>
      ),
      spotlight: null
    },
    {
      title: "Passo 1 - Crie seu Grupo com a IA",
      content: (
        <>
          <p className="mb-4">
            Para começar, você precisa criar um grupo no WhatsApp com o nosso bot de IA chamado Angelina.
          </p>
          <p className="mb-4">
            Nele, você vai mandar mensagens, áudios ou comprovantes, e o sistema vai registrar automaticamente suas despesas e receitas.
          </p>
          <p className="font-semibold text-blue-600">
            👉 Clique em "Grupos" no menu lateral, escolha o nome do grupo e clique em "Cadastrar Grupo".
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
          <p className="text-base mb-4">
            Tudo que você enviar para o grupo vai ser registrado no app.
          </p>
          <p className="text-sm text-gray-600">
            💡 Dica: Use o menu lateral para navegar entre as diferentes seções do sistema.
          </p>
        </>
      ),
      spotlight: null
    }
  ];

  // Função para remover estilos de highlight
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

  const highlightElementStyle = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData?.spotlight) return;

    const element = document.querySelector(`[data-tour="${currentStepData.spotlight}"]`) as HTMLElement;
    if (!element) return;

    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.style.fontWeight = '600';
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
    element.style.border = '2px solid rgba(59, 130, 246, 0.8)';
    element.style.borderRadius = '8px';
    element.style.position = 'relative';
    element.style.zIndex = '9999';
  };

  // Effect para aplicar/remover highlight
  useEffect(() => {
    if (!isOpen) {
      removeHighlightStyle();
      return;
    }

    removeHighlightStyle();

    const currentStepData = steps[currentStep];
    if (currentStepData?.spotlight) {
      const timer = setTimeout(() => {
        highlightElementStyle();
      }, 100);

      cleanupRef.current = () => {
        clearTimeout(timer);
        removeHighlightStyle();
      };
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isOpen, currentStep]);

  useEffect(() => {
    return () => {
      removeHighlightStyle();
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 z-[9997]"
        style={{ zIndex: 9997 }}
      />
      
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
