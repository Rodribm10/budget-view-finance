
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

interface InstanceCreationFormProps {
  instanceName: string;
  onCreateInstance: (ddd: string, phoneNumber: string) => Promise<boolean>;
  loading: boolean;
  userEmail: string;
}

const InstanceCreationForm = ({ 
  instanceName, 
  onCreateInstance, 
  loading, 
  userEmail 
}: InstanceCreationFormProps) => {
  const [ddd, setDdd] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async () => {
    const success = await onCreateInstance(ddd, phoneNumber);
    if (success) {
      setDdd('');
      setPhoneNumber('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
          <CardTitle>Vincular WhatsApp ao App</CardTitle>
        </div>
        <CardDescription>
          Preencha os campos abaixo para conectar sua conta WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instanceName">Nome da Instância</Label>
          <Input
            id="instanceName"
            value={instanceName}
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-muted-foreground">
            O nome da instância será automaticamente seu email de login
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Número do WhatsApp</Label>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-l border border-r-0 border-gray-300">
                +55
              </span>
            </div>
            
            <div className="w-20">
              <Input
                id="ddd"
                value={ddd}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setDdd(value);
                }}
                placeholder="11"
                maxLength={2}
                className="text-center"
              />
            </div>
            
            <div className="flex-1">
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setPhoneNumber(value);
                }}
                placeholder="987654321"
                maxLength={9}
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Digite seu DDD e o número do seu celular
          </p>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={handleSubmit}
          disabled={loading || !userEmail || !ddd.trim() || !phoneNumber.trim()}
        >
          {loading ? "Criando..." : "Criar Instância"}
        </Button>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Importante:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Apenas uma instância por usuário é permitida</li>
            <li>• O nome da instância será seu email de login</li>
            <li>• Após criar, você precisará escanear o QR Code para conectar</li>
            <li>• Sua automação financeira será ativada automaticamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstanceCreationForm;
