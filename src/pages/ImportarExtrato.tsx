import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUpload } from '@/components/importacao/FileUpload';
import { PreviewTransacoes } from '@/components/importacao/PreviewTransacoes';
import { ContaBancariaSelect } from '@/components/importacao/ContaBancariaSelect';
import { NovaContaDialog } from '@/components/importacao/NovaContaDialog';
import { ResultadoImportacaoDialog } from '@/components/importacao/ResultadoImportacaoDialog';
import { useImportacaoExtrato } from '@/hooks/useImportacaoExtrato';
import { useContasBancarias } from '@/hooks/useContasBancarias';
import { detectarTipoArquivo } from '@/services/importacao';
import { LogImportacao } from '@/types/importacaoTypes';
import { ArrowLeft, FileCheck, Upload as UploadIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImportarExtrato = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contaSelecionada, setContaSelecionada] = useState<string>('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [novaContaDialogOpen, setNovaContaDialogOpen] = useState(false);
  const [resultadoDialog, setResultadoDialog] = useState(false);
  const [logImportacao, setLogImportacao] = useState<LogImportacao | null>(null);

  const { transacoes, isProcessing, isImporting, processarArquivo, importar, limpar, atualizarCategoria } = useImportacaoExtrato();
  const { contas, isLoading, criar, recarregar } = useContasBancarias();

  const handleFileSelect = async (file: File) => {
    setArquivo(file);
    if (contaSelecionada) {
      await processarArquivo(file, contaSelecionada);
      setStep(2);
    }
  };

  const handleContaChange = async (contaId: string) => {
    setContaSelecionada(contaId);
    if (arquivo) {
      await processarArquivo(arquivo, contaId);
      if (transacoes.length > 0) {
        setStep(2);
      }
    }
  };

  const handleNovaConta = async (novaConta: any) => {
    const conta = await criar(novaConta);
    setContaSelecionada(conta.id);
    await recarregar();
  };

  const handleImportar = async () => {
    if (!arquivo || !contaSelecionada) return;

    const tipoArquivo = detectarTipoArquivo(arquivo.name);
    if (!tipoArquivo) return;

    try {
      const log = await importar(transacoes, contaSelecionada, arquivo.name, tipoArquivo);
      setLogImportacao(log);
      setResultadoDialog(true);
      
      // Limpar estado após importação
      setStep(1);
      setArquivo(null);
      setContaSelecionada('');
      limpar();
    } catch (error) {
      console.error('Erro ao importar:', error);
    }
  };

  const handleVoltar = () => {
    if (step === 2) {
      setStep(1);
      limpar();
    } else {
      navigate('/dashboard');
    }
  };

  const novasTransacoes = transacoes.filter(t => !t.isDuplicada);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleVoltar}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Importar Extrato Bancário</h1>
              <p className="text-muted-foreground">
                Importe seus extratos em OFX, CSV ou XLSX
              </p>
            </div>
          </div>
        </div>

        {/* Steps indicator */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                1
              </div>
              <span className="font-medium">Selecionar Arquivo</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4" />
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                2
              </div>
              <span className="font-medium">Revisar Dados</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-4" />
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                3
              </div>
              <span className="font-medium">Confirmar</span>
            </div>
          </div>
        </Card>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-6">
            <ContaBancariaSelect
              contas={contas}
              value={contaSelecionada}
              onChange={handleContaChange}
              onNovaConta={() => setNovaContaDialogOpen(true)}
              isLoading={isLoading}
            />

            {contaSelecionada && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UploadIcon className="w-5 h-5 text-primary" />
                  Upload do Extrato
                </h3>
                <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && transacoes.length > 0 && (
          <div className="space-y-6">
            <PreviewTransacoes
              transacoes={transacoes}
              onCategoriaChange={atualizarCategoria}
            />

            <Card className="p-6">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handleVoltar}>
                  Voltar
                </Button>
                <Button
                  onClick={handleImportar}
                  disabled={isImporting || novasTransacoes.length === 0}
                  size="lg"
                >
                  <FileCheck className="w-5 h-5 mr-2" />
                  {isImporting ? 'Importando...' : `Importar ${novasTransacoes.length} Transações`}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <NovaContaDialog
        open={novaContaDialogOpen}
        onOpenChange={setNovaContaDialogOpen}
        onSave={handleNovaConta}
      />

      <ResultadoImportacaoDialog
        open={resultadoDialog}
        onOpenChange={setResultadoDialog}
        log={logImportacao}
      />
    </div>
  );
};

export default ImportarExtrato;
