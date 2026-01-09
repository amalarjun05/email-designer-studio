import { forwardRef } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Type, 
  Image as ImageIcon, 
  MousePointer2, 
  Minus, 
  Space
} from 'lucide-react';
import { ContentBlock, ContentBlockType } from './types';
import { DraggableContentBlock } from './DraggableContentBlock';

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  accentColor: string;
  onAdd: (type: ContentBlockType) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: keyof ContentBlock, value: any) => void;
  onReorder: (blocks: ContentBlock[]) => void;
}

const blockTypeIcons = {
  text: Type,
  image: ImageIcon,
  button: MousePointer2,
  divider: Minus,
  spacer: Space,
};

export const ContentBlockEditor = forwardRef<HTMLElement, ContentBlockEditorProps>(({
  blocks,
  accentColor,
  onAdd,
  onRemove,
  onUpdate,
  onReorder
}, ref) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      onReorder(newBlocks);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Content Blocks
        </label>
      </div>

      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-xl border border-border">
        {(Object.keys(blockTypeIcons) as ContentBlockType[]).map((type) => {
          const Icon = blockTypeIcons[type];
          return (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold bg-card border border-border rounded-lg hover:bg-secondary transition-all hover:scale-105"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Block List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((block) => (
              <DraggableContentBlock
                key={block.id}
                block={block}
                accentColor={accentColor}
                onRemove={onRemove}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="p-4 text-center text-[11px] text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
          Add content blocks above to customize your email
        </div>
      )}
    </section>
  );
});

ContentBlockEditor.displayName = 'ContentBlockEditor';
