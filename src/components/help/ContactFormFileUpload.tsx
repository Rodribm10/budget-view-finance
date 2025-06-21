
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactFormFileUploadProps {
  anexo: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

const ContactFormFileUpload = ({ anexo, onFileChange, onRemoveFile }: ContactFormFileUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Anexo (opcional)</Label>
      {anexo ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
          <span className="flex-1 text-sm">{anexo.name}</span>
          <Button type="button" variant="ghost" size="sm" onClick={onRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={onFileChange}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Envie uma imagem
          </Label>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Formatos aceitos: imagens, PDF, DOC, DOCX (máx. 5MB)
      </p>
    </div>
  );
};

export default ContactFormFileUpload;
