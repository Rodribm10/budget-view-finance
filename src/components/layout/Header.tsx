
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      )}
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">Finance Home</h1>
      </div>
    </div>
  );
}
