import { useRef } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  MousePointer2, 
  Minus, 
  Space,
  Trash2,
  GripVertical,
  Link as LinkIcon,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ContentBlock, ContentBlockType, ImageSettings } from './types';
import { ImageControls } from './ImageControls';

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  accentColor: string;
  onAdd: (type: ContentBlockType) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: keyof ContentBlock, value: any) => void;
  onMove: (id: number, direction: 'up' | 'down') => void;
}

const blockTypeIcons = {
  text: Type,
  image: ImageIcon,
  button: MousePointer2,
  divider: Minus,
  spacer: Space,
};

const blockTypeLabels = {
  text: 'Text Block',
  image: 'Image Block',
  button: 'Button Block',
  divider: 'Divider',
  spacer: 'Spacer',
};

export const ContentBlockEditor = ({
  blocks,
  accentColor,
  onAdd,
  onRemove,
  onUpdate,
  onMove
}: ContentBlockEditorProps) => {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleImageUpload = (blockId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate(blockId, 'content', reader.result as string);
      reader.readAsDataURL(file);
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

      {/* Block List */}
      <div className="space-y-2">
        {blocks.map((block, index) => {
          const Icon = blockTypeIcons[block.type];
          return (
            <div 
              key={block.id} 
              className="p-3 bg-secondary/50 rounded-xl border border-border space-y-3 group animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    {blockTypeLabels[block.type]}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onMove(block.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onMove(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onRemove(block.id)} 
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {block.type === 'text' && (
                <textarea
                  rows={3}
                  placeholder="Enter text content..."
                  className="w-full p-2.5 bg-card border border-border rounded-lg text-xs leading-relaxed outline-none focus:ring-2 ring-primary/20 resize-none transition-all"
                  value={block.content}
                  onChange={(e) => onUpdate(block.id, 'content', e.target.value)}
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-card border border-border rounded-lg">
                    {block.content && (
                      <img 
                        src={block.content} 
                        alt="Block" 
                        className="w-12 h-12 object-cover rounded-lg"
                        style={{
                          transform: block.imageSettings ? `rotate(${block.imageSettings.rotation}deg)` : undefined,
                          borderRadius: block.imageSettings ? `${block.imageSettings.borderRadius}px` : undefined
                        }}
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <button 
                        onClick={() => fileInputRefs.current[block.id]?.click()}
                        className="w-full py-1.5 flex items-center justify-center gap-2 text-[10px] font-semibold bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-all"
                      >
                        <ImageIcon className="w-3 h-3" /> Upload
                      </button>
                      <input
                        type="file"
                        ref={(el) => { fileInputRefs.current[block.id] = el; }}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(block.id, e)}
                      />
                      <input
                        type="text"
                        placeholder="Or paste URL"
                        className="w-full text-[10px] p-1.5 bg-card border border-border rounded-lg outline-none focus:ring-2 ring-primary/20"
                        value={block.content}
                        onChange={(e) => onUpdate(block.id, 'content', e.target.value)}
                      />
                    </div>
                  </div>
                  {block.content && block.imageSettings && (
                    <ImageControls
                      settings={block.imageSettings}
                      onChange={(settings) => onUpdate(block.id, 'imageSettings', settings)}
                    />
                  )}
                </div>
              )}

              {block.type === 'button' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Button Label"
                    className="w-full p-2 bg-card border border-border rounded-lg text-xs font-semibold outline-none focus:ring-2 ring-primary/20 transition-all"
                    value={block.content}
                    onChange={(e) => onUpdate(block.id, 'content', e.target.value)}
                  />
                  <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                    <LinkIcon className="w-3 h-3 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Button URL"
                      className="flex-1 bg-transparent text-[10px] outline-none"
                      value={block.link || ''}
                      onChange={(e) => onUpdate(block.id, 'link', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {block.type === 'divider' && (
                <div className="h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />
              )}

              {block.type === 'spacer' && (
                <div className="h-8 flex items-center justify-center text-[10px] text-muted-foreground border border-dashed border-border rounded-lg">
                  Vertical Space
                </div>
              )}
            </div>
          );
        })}
      </div>

      {blocks.length === 0 && (
        <div className="p-4 text-center text-[11px] text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
          Add content blocks above to customize your email
        </div>
      )}
    </section>
  );
};
