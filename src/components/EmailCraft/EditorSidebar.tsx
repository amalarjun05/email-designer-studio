import { useRef, useState, forwardRef } from 'react';
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
  Layout, 
  Image as ImageIcon, 
  Trash2, 
  PlusCircle, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Palette,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { EmailData, ColorPalette, ContentBlockType, ImageSettings, ContentBlock, EmailButton, ExtraBlock } from './types';
import { COLOR_PALETTES } from './templates';
import { ImageControls } from './ImageControls';
import { ContentBlockEditor } from './ContentBlockEditor';
import { DraggableButton } from './DraggableButton';
import { DraggableExtraBlock } from './DraggableExtraBlock';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

interface EditorSidebarProps {
  data: EmailData;
  updateData: (field: keyof EmailData, value: any) => void;
  addButton: () => void;
  removeButton: (id: number) => void;
  updateButton: (id: number, field: string, value: string) => void;
  reorderButtons: (buttons: EmailButton[]) => void;
  addExtraBlock: () => void;
  removeExtraBlock: (id: number) => void;
  updateExtraBlock: (id: number, value: string) => void;
  reorderExtraBlocks: (blocks: ExtraBlock[]) => void;
  updateSocial: (platform: string, value: string) => void;
  addContentBlock: (type: ContentBlockType) => void;
  removeContentBlock: (id: number) => void;
  updateContentBlock: (id: number, field: string, value: any) => void;
  reorderContentBlocks: (blocks: ContentBlock[]) => void;
  updateLogoSettings: (settings: ImageSettings) => void;
  onLogoUpload: (file: File) => Promise<void>;
}

export const EditorSidebar = forwardRef<HTMLElement, EditorSidebarProps>(({
  data,
  updateData,
  addButton,
  removeButton,
  updateButton,
  reorderButtons,
  addExtraBlock,
  removeExtraBlock,
  updateExtraBlock,
  reorderExtraBlocks,
  updateSocial,
  addContentBlock,
  removeContentBlock,
  updateContentBlock,
  reorderContentBlocks,
  updateLogoSettings,
  onLogoUpload
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoControlsOpen, setLogoControlsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    toast.loading('Uploading logo...', { id: 'logo-upload' });
    
    try {
      await onLogoUpload(file);
      toast.success('Logo uploaded!', { id: 'logo-upload' });
    } catch (error) {
      toast.error('Failed to upload logo', { id: 'logo-upload' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const applyPalette = (palette: ColorPalette) => {
    updateData('accentColor', palette.accent);
    updateData('backgroundColor', palette.background);
  };

  const handleButtonsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.buttons.findIndex((b) => b.id === active.id);
      const newIndex = data.buttons.findIndex((b) => b.id === over.id);
      reorderButtons(arrayMove(data.buttons, oldIndex, newIndex));
    }
  };

  const handleExtraBlocksDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.extraBlocks.findIndex((b) => b.id === active.id);
      const newIndex = data.extraBlocks.findIndex((b) => b.id === over.id);
      reorderExtraBlocks(arrayMove(data.extraBlocks, oldIndex, newIndex));
    }
  };

  return (
    <aside className="w-full lg:w-[380px] bg-card border-l border-border overflow-y-auto shrink-0 pb-20 custom-scrollbar">
      <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
        <h2 className="font-bold flex items-center gap-2 text-foreground">
          <Layout className="w-4 h-4 text-primary" /> Designer
        </h2>
      </div>

      <div className="p-5 space-y-8">
        {/* Quick Color Palettes */}
        <section>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
            <Palette className="w-3 h-3" /> Quick Palettes
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => applyPalette(palette)}
                className="group relative w-8 h-8 rounded-lg border-2 border-border hover:border-primary transition-all hover:scale-110 shadow-soft"
                style={{ backgroundColor: palette.accent }}
                title={palette.name}
              >
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {palette.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Logo Section with Controls */}
        <section>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">
            Logo Asset
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl border border-border">
              <img 
                src={data.logo} 
                className="w-12 h-12 rounded-xl object-contain shadow-soft bg-card" 
                alt="Preview"
                style={{
                  transform: `rotate(${data.logoSettings.rotation}deg)`,
                  borderRadius: `${data.logoSettings.borderRadius}px`,
                  width: `${Math.min(data.logoSettings.size, 48)}px`,
                  height: `${Math.min(data.logoSettings.size, 48)}px`
                }}
              />
              <div className="flex-1 space-y-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold bg-card border border-border rounded-lg hover:bg-secondary transition-all shadow-soft disabled:opacity-50"
                >
                  {isUploading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                  ) : (
                    <><ImageIcon className="w-3.5 h-3.5" /> Upload to Cloud</>
                  )}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <input 
                  type="text"
                  placeholder="Or paste URL"
                  className="w-full text-[10px] p-2 bg-card border border-border rounded-lg outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={data.logo}
                  onChange={(e) => updateData('logo', e.target.value)}
                />
              </div>
            </div>
            
            <Collapsible open={logoControlsOpen} onOpenChange={setLogoControlsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 px-3 text-[10px] font-semibold text-muted-foreground bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-all">
                <span>Image Controls</span>
                {logoControlsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ImageControls settings={data.logoSettings} onChange={updateLogoSettings} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>

        {/* Main Content */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Main Message</label>
          <input 
            type="text"
            placeholder="Headline"
            className="w-full p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 ring-primary/20 outline-none text-sm font-semibold shadow-soft transition-all"
            value={data.title}
            onChange={(e) => updateData('title', e.target.value)}
          />
          <textarea 
            rows={4}
            placeholder="Body text"
            className="w-full p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 ring-primary/20 outline-none text-xs leading-relaxed resize-none shadow-soft transition-all"
            value={data.body}
            onChange={(e) => updateData('body', e.target.value)}
          />
        </section>

        {/* Content Blocks with Drag & Drop */}
        <ContentBlockEditor
          blocks={data.contentBlocks}
          accentColor={data.accentColor}
          onAdd={addContentBlock}
          onRemove={removeContentBlock}
          onUpdate={updateContentBlock}
          onReorder={reorderContentBlocks}
        />

        {/* Buttons with Drag & Drop */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Call to Action</label>
            <button onClick={addButton} className="text-primary hover:text-primary/80 font-semibold text-[10px] flex items-center gap-1 transition-colors">
              <PlusCircle className="w-3 h-3" /> Add
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleButtonsDragEnd}>
            <SortableContext items={data.buttons.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {data.buttons.map((btn, idx) => (
                  <DraggableButton key={btn.id} button={btn} index={idx} total={data.buttons.length} onUpdate={updateButton} onRemove={removeButton} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        {/* Extra Blocks with Drag & Drop */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Extra Content</label>
            <button onClick={addExtraBlock} className="text-primary hover:text-primary/80 font-semibold text-[10px] flex items-center gap-1 transition-colors">
              <PlusCircle className="w-3 h-3" /> Add
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExtraBlocksDragEnd}>
            <SortableContext items={data.extraBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {data.extraBlocks.map((block) => (
                  <DraggableExtraBlock key={block.id} block={block} onUpdate={updateExtraBlock} onRemove={removeExtraBlock} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        {/* Social Links */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Social Links</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(data.social).map(([platform, value]) => (
              <div key={platform} className="flex items-center gap-3 p-2.5 bg-secondary/50 border border-border rounded-xl transition-all focus-within:ring-2 ring-primary/20">
                {platform === 'facebook' && <Facebook className="w-4 h-4 text-muted-foreground" />}
                {platform === 'twitter' && <Twitter className="w-4 h-4 text-muted-foreground" />}
                {platform === 'linkedin' && <Linkedin className="w-4 h-4 text-muted-foreground" />}
                {platform === 'instagram' && <Instagram className="w-4 h-4 text-muted-foreground" />}
                <input type="text" placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`} className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/50" value={value} onChange={(e) => updateSocial(platform, e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        {/* Theme Colors */}
        <section className="space-y-3 pt-6 border-t border-border">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Custom Colors</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary/50 rounded-xl border border-border flex flex-col items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Accent</span>
              <input type="color" className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border bg-transparent" value={data.accentColor} onChange={(e) => updateData('accentColor', e.target.value)} />
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl border border-border flex flex-col items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Background</span>
              <input type="color" className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border bg-transparent" value={data.backgroundColor} onChange={(e) => updateData('backgroundColor', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="pb-6">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">Footer Text</label>
          <textarea rows={2} className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-xs text-muted-foreground outline-none focus:ring-2 ring-primary/20 shadow-soft transition-all" value={data.footer} onChange={(e) => updateData('footer', e.target.value)} />
        </section>
      </div>
    </aside>
  );
});

EditorSidebar.displayName = 'EditorSidebar';
