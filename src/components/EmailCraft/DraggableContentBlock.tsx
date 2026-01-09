import { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Type, 
  Image as ImageIcon, 
  MousePointer2, 
  Minus, 
  Space,
  Trash2,
  GripVertical,
  Link as LinkIcon,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2
} from 'lucide-react';
import { ContentBlock, TextFormatting, FontFamily } from './types';
import { ImageControls } from './ImageControls';
import { uploadImage } from './useImageUpload';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DraggableContentBlockProps {
  block: ContentBlock;
  accentColor: string;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: keyof ContentBlock, value: any) => void;
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

const fontFamilies: { value: FontFamily; label: string; style: string }[] = [
  { value: 'system', label: 'System', style: '-apple-system, BlinkMacSystemFont, sans-serif' },
  { value: 'sans-serif', label: 'Sans Serif', style: 'Arial, Helvetica, sans-serif' },
  { value: 'serif', label: 'Serif', style: 'Georgia, Times, serif' },
  { value: 'mono', label: 'Monospace', style: 'Monaco, Consolas, monospace' },
  { value: 'georgia', label: 'Georgia', style: 'Georgia, serif' },
  { value: 'arial', label: 'Arial', style: 'Arial, sans-serif' },
  { value: 'times', label: 'Times', style: '"Times New Roman", Times, serif' },
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];

const defaultTextFormatting: TextFormatting = {
  bold: false,
  italic: false,
  align: 'left',
  fontFamily: 'system',
  fontSize: 16
};

export const DraggableContentBlock = ({
  block,
  accentColor,
  onRemove,
  onUpdate
}: DraggableContentBlockProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingRef.current) return;

    uploadingRef.current = true;
    toast.loading('Uploading image...', { id: 'upload' });
    
    const url = await uploadImage(file);
    
    if (url) {
      onUpdate(block.id, 'content', url);
      toast.success('Image uploaded!', { id: 'upload' });
    } else {
      toast.error('Upload failed', { id: 'upload' });
    }
    
    uploadingRef.current = false;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateTextFormatting = (field: keyof TextFormatting, value: any) => {
    const formatting = block.textFormatting || defaultTextFormatting;
    onUpdate(block.id, 'textFormatting', { ...formatting, [field]: value });
  };

  const getFontStyle = () => {
    const fontFamily = block.textFormatting?.fontFamily || 'system';
    return fontFamilies.find(f => f.value === fontFamily)?.style || fontFamilies[0].style;
  };

  const Icon = blockTypeIcons[block.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-secondary/50 rounded-xl border border-border space-y-3 group animate-fade-in"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded transition-colors"
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
          </button>
          <Icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            {blockTypeLabels[block.type]}
          </span>
        </div>
        <button 
          onClick={() => onRemove(block.id)} 
          className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {block.type === 'text' && (
        <div className="space-y-2">
          {/* Text Formatting Controls */}
          <div className="flex items-center gap-1 p-1.5 bg-card border border-border rounded-lg flex-wrap">
            <button
              onClick={() => updateTextFormatting('bold', !(block.textFormatting?.bold ?? false))}
              className={`p-1.5 rounded transition-colors ${block.textFormatting?.bold ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateTextFormatting('italic', !(block.textFormatting?.italic ?? false))}
              className={`p-1.5 rounded transition-colors ${block.textFormatting?.italic ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => updateTextFormatting('align', 'left')}
              className={`p-1.5 rounded transition-colors ${(block.textFormatting?.align ?? 'left') === 'left' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateTextFormatting('align', 'center')}
              className={`p-1.5 rounded transition-colors ${block.textFormatting?.align === 'center' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateTextFormatting('align', 'right')}
              className={`p-1.5 rounded transition-colors ${block.textFormatting?.align === 'right' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Font Controls */}
          <div className="flex items-center gap-2">
            <Select
              value={block.textFormatting?.fontFamily || 'system'}
              onValueChange={(value: FontFamily) => updateTextFormatting('fontFamily', value)}
            >
              <SelectTrigger className="h-8 text-[10px] flex-1">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.style }}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(block.textFormatting?.fontSize || 16)}
              onValueChange={(value) => updateTextFormatting('fontSize', Number(value))}
            >
              <SelectTrigger className="h-8 text-[10px] w-20">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              textAlign: block.textFormatting?.align ?? 'left',
              fontFamily: getFontStyle(),
              fontSize: `${block.textFormatting?.fontSize || 16}px`
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
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 flex items-center justify-center gap-2 text-[10px] font-semibold bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-all"
              >
                <ImageIcon className="w-3 h-3" /> Upload to Cloud
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
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
};
