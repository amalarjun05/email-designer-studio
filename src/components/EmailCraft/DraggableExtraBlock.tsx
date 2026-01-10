import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { ExtraBlock } from './types';

interface DraggableExtraBlockProps {
  block: ExtraBlock;
  onUpdate: (id: number, value: string) => void;
  onRemove: (id: number) => void;
}

export const DraggableExtraBlock = ({
  block,
  onUpdate,
  onRemove
}: DraggableExtraBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

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
      className="relative group animate-fade-in"
    >
      <div className="absolute top-2 left-2 z-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 bg-card/90 hover:bg-secondary rounded transition-colors"
        >
          <GripVertical className="w-3 h-3 text-muted-foreground/50" />
        </button>
      </div>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onRemove(block.id)}
          className="p-1 bg-card/90 text-muted-foreground hover:text-destructive transition-colors rounded"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <textarea 
        rows={2}
        className="w-full p-3 pl-10 pr-10 bg-secondary/50 border border-border rounded-xl focus:ring-2 ring-primary/20 outline-none text-xs leading-relaxed resize-none shadow-soft transition-all"
        value={block.text}
        onChange={(e) => onUpdate(block.id, e.target.value)}
      />
    </div>
  );
};
