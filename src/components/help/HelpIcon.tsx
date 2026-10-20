
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
        aria-label="Ajuda"
        className="fixed bottom-20 right-4 z-30 h-10 w-10 rounded-full border bg-card p-0 text-muted-foreground shadow-sm hover:bg-secondary hover:text-foreground md:bottom-6 md:right-6"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-5 w-5" />
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
