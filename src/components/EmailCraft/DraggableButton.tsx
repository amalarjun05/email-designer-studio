import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Link as LinkIcon } from 'lucide-react';
import { EmailButton } from './types';

interface DraggableButtonProps {
  button: EmailButton;
  index: number;
  total: number;
  onUpdate: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
}

export const DraggableButton = ({
  button,
  index,
  total,
  onUpdate,
  onRemove
}: DraggableButtonProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: button.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-secondary/50 rounded-xl border border-border space-y-2 group animate-fade-in"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded transition-colors"
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
          </button>
          <span className="text-[9px] font-bold text-muted-foreground uppercase">
            Button {index + 1}
          </span>
        </div>
        <button 
          onClick={() => onRemove(button.id)} 
          className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <input 
        type="text"
        placeholder="Label"
        className="w-full p-2 bg-card border border-border rounded-lg text-xs font-semibold outline-none focus:ring-2 ring-primary/20 transition-all"
        value={button.text}
        onChange={(e) => onUpdate(button.id, 'text', e.target.value)}
      />
      <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
        <LinkIcon className="w-3 h-3 text-muted-foreground" />
        <input 
          type="text"
          placeholder="URL"
          className="flex-1 bg-transparent text-[10px] outline-none"
          value={button.link}
          onChange={(e) => onUpdate(button.id, 'link', e.target.value)}
        />
      </div>
    </div>
  );
};
