
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FAQList from './FAQList';
import ContactForm from './ContactForm';

const HelpIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-blue-600 text-white hover:bg-blue-700 border-0 flex flex-col items-center justify-center p-2"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-6 w-6 mb-1" />
        <span className="text-xs font-medium">Ajuda</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {showContact ? 'Fale Conosco' : 'Como podemos ajudar?'}
            </DialogTitle>
          </DialogHeader>
          
          {showContact ? (
            <ContactForm onBack={() => setShowContact(false)} />
          ) : (
            <div className="space-y-6">
              <FAQList />
              <div className="flex justify-center pt-4 border-t">
                <Button 
                  onClick={() => setShowContact(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg"
                >
                  Fale com a gente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpIcon;
