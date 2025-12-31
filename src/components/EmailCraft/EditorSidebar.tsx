import { useRef } from 'react';
import { 
  Layout, 
  Image as ImageIcon, 
  Trash2, 
  PlusCircle, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Link as LinkIcon,
  Palette,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EmailData, ColorPalette, ContentBlockType, ImageSettings } from './types';
import { COLOR_PALETTES } from './templates';
import { ImageControls } from './ImageControls';
import { ContentBlockEditor } from './ContentBlockEditor';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from 'react';

interface EditorSidebarProps {
  data: EmailData;
  updateData: (field: keyof EmailData, value: any) => void;
  addButton: () => void;
  removeButton: (id: number) => void;
  updateButton: (id: number, field: string, value: string) => void;
  moveButton: (id: number, direction: 'up' | 'down') => void;
  addExtraBlock: () => void;
  removeExtraBlock: (id: number) => void;
  updateExtraBlock: (id: number, value: string) => void;
  moveExtraBlock: (id: number, direction: 'up' | 'down') => void;
  updateSocial: (platform: string, value: string) => void;
  addContentBlock: (type: ContentBlockType) => void;
  removeContentBlock: (id: number) => void;
  updateContentBlock: (id: number, field: string, value: any) => void;
  moveContentBlock: (id: number, direction: 'up' | 'down') => void;
  updateLogoSettings: (settings: ImageSettings) => void;
}

export const EditorSidebar = ({
  data,
  updateData,
  addButton,
  removeButton,
  updateButton,
  moveButton,
  addExtraBlock,
  removeExtraBlock,
  updateExtraBlock,
  moveExtraBlock,
  updateSocial,
  addContentBlock,
  removeContentBlock,
  updateContentBlock,
  moveContentBlock,
  updateLogoSettings
}: EditorSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoControlsOpen, setLogoControlsOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateData('logo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const applyPalette = (palette: ColorPalette) => {
    updateData('accentColor', palette.accent);
    updateData('backgroundColor', palette.background);
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
                className="w-12 h-12 rounded-xl object-cover shadow-soft bg-card" 
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
                  className="w-full py-2 flex items-center justify-center gap-2 text-xs font-semibold bg-card border border-border rounded-lg hover:bg-secondary transition-all shadow-soft"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Upload
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
                <ImageControls 
                  settings={data.logoSettings} 
                  onChange={updateLogoSettings}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>

        {/* Main Content */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            Main Message
          </label>
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

        {/* Content Blocks */}
        <ContentBlockEditor
          blocks={data.contentBlocks}
          accentColor={data.accentColor}
          onAdd={addContentBlock}
          onRemove={removeContentBlock}
          onUpdate={updateContentBlock}
          onMove={moveContentBlock}
        />

        {/* Buttons */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Call to Action
            </label>
            <button 
              onClick={addButton} 
              className="text-primary hover:text-primary/80 font-semibold text-[10px] flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {data.buttons.map((btn, idx) => (
              <div 
                key={btn.id} 
                className="p-3 bg-secondary/50 rounded-xl border border-border space-y-2 group animate-fade-in"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">
                    Button {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveButton(btn.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveButton(btn.id, 'down')}
                      disabled={idx === data.buttons.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => removeButton(btn.id)} 
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input 
                  type="text"
                  placeholder="Label"
                  className="w-full p-2 bg-card border border-border rounded-lg text-xs font-semibold outline-none focus:ring-2 ring-primary/20 transition-all"
                  value={btn.text}
                  onChange={(e) => updateButton(btn.id, 'text', e.target.value)}
                />
                <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                  <LinkIcon className="w-3 h-3 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="URL"
                    className="flex-1 bg-transparent text-[10px] outline-none"
                    value={btn.link}
                    onChange={(e) => updateButton(btn.id, 'link', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Extra Blocks */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Extra Content
            </label>
            <button 
              onClick={addExtraBlock} 
              className="text-primary hover:text-primary/80 font-semibold text-[10px] flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {data.extraBlocks.map((block, idx) => (
              <div key={block.id} className="relative group animate-fade-in">
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => moveExtraBlock(block.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 bg-card/90 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveExtraBlock(block.id, 'down')}
                    disabled={idx === data.extraBlocks.length - 1}
                    className="p-1 bg-card/90 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => removeExtraBlock(block.id)}
                    className="p-1 bg-card/90 text-muted-foreground hover:text-destructive transition-colors rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <textarea 
                  rows={2}
                  className="w-full p-3 pr-24 bg-secondary/50 border border-border rounded-xl focus:ring-2 ring-primary/20 outline-none text-xs leading-relaxed resize-none shadow-soft transition-all"
                  value={block.text}
                  onChange={(e) => updateExtraBlock(block.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            Social Links
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(data.social).map(([platform, value]) => (
              <div 
                key={platform} 
                className="flex items-center gap-3 p-2.5 bg-secondary/50 border border-border rounded-xl transition-all focus-within:ring-2 ring-primary/20"
              >
                {platform === 'facebook' && <Facebook className="w-4 h-4 text-muted-foreground" />}
                {platform === 'twitter' && <Twitter className="w-4 h-4 text-muted-foreground" />}
                {platform === 'linkedin' && <Linkedin className="w-4 h-4 text-muted-foreground" />}
                {platform === 'instagram' && <Instagram className="w-4 h-4 text-muted-foreground" />}
                <input 
                  type="text"
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                  className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/50"
                  value={value}
                  onChange={(e) => updateSocial(platform, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Theme Colors */}
        <section className="space-y-3 pt-6 border-t border-border">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            Custom Colors
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary/50 rounded-xl border border-border flex flex-col items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Accent</span>
              <input 
                type="color" 
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border bg-transparent" 
                value={data.accentColor} 
                onChange={(e) => updateData('accentColor', e.target.value)} 
              />
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl border border-border flex flex-col items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Background</span>
              <input 
                type="color" 
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border bg-transparent" 
                value={data.backgroundColor} 
                onChange={(e) => updateData('backgroundColor', e.target.value)} 
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="pb-6">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">
            Footer Text
          </label>
          <textarea 
            rows={2}
            className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-xs text-muted-foreground outline-none focus:ring-2 ring-primary/20 shadow-soft transition-all"
            value={data.footer}
            onChange={(e) => updateData('footer', e.target.value)}
          />
        </section>
      </div>
    </aside>
  );
};
