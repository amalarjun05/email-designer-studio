import { Monitor, Smartphone, Tablet } from 'lucide-react';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface PreviewHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const PreviewHeader = ({ viewMode, onViewModeChange }: PreviewHeaderProps) => {
  const modes: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
    { id: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
    { id: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
  ];

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex bg-secondary p-1 rounded-lg">
        {modes.map((mode) => (
          <button 
            key={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-all duration-200 ${
              viewMode === mode.id 
                ? 'bg-card shadow-soft text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {mode.icon}
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>
      
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
        Live Preview
      </div>
    </header>
  );
};
