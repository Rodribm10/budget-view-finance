import { useRef, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
        `}
        onClick={() => !isProcessing && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".ofx,.csv,.xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        
        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <File className="w-5 h-5" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <>
            <p className="text-lg font-medium text-foreground mb-2">
              Arraste seu extrato aqui
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: OFX, CSV, XLSX, XLS (máx. 10MB)
            </p>
          </>
        )}
      </div>

      {selectedFile && !isProcessing && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedFile(null);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }}
        >
          Selecionar outro arquivo
        </Button>
      )}
    </div>
  );
};
