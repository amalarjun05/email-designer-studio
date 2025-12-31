import { useRef, forwardRef } from 'react';
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
  ChevronDown,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { ContentBlock, ContentBlockType, ImageSettings, TextFormatting, TextAlign } from './types';
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

const defaultTextFormatting: TextFormatting = {
  bold: false,
  italic: false,
  align: 'left'
};

export const ContentBlockEditor = forwardRef<HTMLElement, ContentBlockEditorProps>(({
  blocks,
  accentColor,
  onAdd,
  onRemove,
  onUpdate,
  onMove
}, ref) => {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleImageUpload = (blockId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate(blockId, 'content', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateTextFormatting = (blockId: number, currentFormatting: TextFormatting | undefined, field: keyof TextFormatting, value: any) => {
    const formatting = currentFormatting || defaultTextFormatting;
    onUpdate(blockId, 'textFormatting', { ...formatting, [field]: value });
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
                <div className="space-y-2">
                  {/* Text Formatting Controls */}
                  <div className="flex items-center gap-1 p-1.5 bg-card border border-border rounded-lg">
                    <button
                      onClick={() => updateTextFormatting(block.id, block.textFormatting, 'bold', !(block.textFormatting?.bold ?? false))}
                      className={`p-1.5 rounded transition-colors ${block.textFormatting?.bold ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateTextFormatting(block.id, block.textFormatting, 'italic', !(block.textFormatting?.italic ?? false))}
                      className={`p-1.5 rounded transition-colors ${block.textFormatting?.italic ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                      onClick={() => updateTextFormatting(block.id, block.textFormatting, 'align', 'left')}
                      className={`p-1.5 rounded transition-colors ${(block.textFormatting?.align ?? 'left') === 'left' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                      title="Align Left"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateTextFormatting(block.id, block.textFormatting, 'align', 'center')}
                      className={`p-1.5 rounded transition-colors ${block.textFormatting?.align === 'center' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                      title="Align Center"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateTextFormatting(block.id, block.textFormatting, 'align', 'right')}
                      className={`p-1.5 rounded transition-colors ${block.textFormatting?.align === 'right' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                      title="Align Right"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter text content..."
                    className="w-full p-2.5 bg-card border border-border rounded-lg text-xs leading-relaxed outline-none focus:ring-2 ring-primary/20 resize-none transition-all"
                    value={block.content}
                    onChange={(e) => onUpdate(block.id, 'content', e.target.value)}
                    style={{
                      fontWeight: block.textFormatting?.bold ? 'bold' : 'normal',
                      fontStyle: block.textFormatting?.italic ? 'italic' : 'normal',
                      textAlign: block.textFormatting?.align ?? 'left'
                    }}
                  />
                </div>
              )}

              {block.type === 'image' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 bg-card border border-border rounded-lg">
                    {block.content && (
                      <div className="shrink-0 w-16 h-16 bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={block.content} 
                          alt="Block" 
                          className="max-w-full max-h-full object-contain"
                          style={{
                            transform: block.imageSettings ? `rotate(${block.imageSettings.rotation}deg)` : undefined,
                            borderRadius: block.imageSettings ? `${block.imageSettings.borderRadius}px` : undefined
                          }}
                        />
                      </div>
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
});

ContentBlockEditor.displayName = 'ContentBlockEditor';
