
interface ConnectedInstanceMessageProps {
  instanceData: {
    instancia_zap: string;
    status_instancia: string;
  };
}

const ConnectedInstanceMessage = ({ instanceData }: ConnectedInstanceMessageProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            WhatsApp Conectado ✅
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>Você já possui uma instância do WhatsApp conectada: <strong>{instanceData.instancia_zap}</strong></p>
            <p>Status: <strong>{instanceData.status_instancia}</strong></p>
            <p>Agora você pode criar grupos WhatsApp!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedInstanceMessage;
