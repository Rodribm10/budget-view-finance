
import React from 'react';
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
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.8)',
      pointerEvents: 'none' as const,
      zIndex: 9998
    };
  };

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-[9997]"
        style={{ zIndex: 9997 }}
      />
      
      {/* Spotlight */}
      {currentStepData.spotlight && (
        <div style={getSpotlightStyle()} />
      )}
      
      {/* Card do tour */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl">
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
                <Button variant="outline" onClick={onSkip}>
                  Pular Tour
                </Button>
                <Button onClick={onNext}>
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
