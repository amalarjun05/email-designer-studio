import { Monitor, Smartphone, Tablet, Undo2, Redo2 } from 'lucide-react';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface PreviewHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const PreviewHeader = ({ 
  viewMode, 
  onViewModeChange,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo
}: PreviewHeaderProps) => {
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
      
      {/* Undo/Redo Controls */}
      <div className="flex items-center gap-2">
        <div className="flex bg-secondary p-1 rounded-lg">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-all duration-200 ${
              canUndo
                ? 'text-muted-foreground hover:text-foreground hover:bg-card'
                : 'text-muted-foreground/30 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-all duration-200 ${
              canRedo
                ? 'text-muted-foreground hover:text-foreground hover:bg-card'
                : 'text-muted-foreground/30 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Redo</span>
          </button>
        </div>
        
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
          Live Preview
        </div>
      </div>
    </header>
  );
};
