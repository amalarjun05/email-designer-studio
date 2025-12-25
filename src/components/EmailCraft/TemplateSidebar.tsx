import { Mail, Copy, Check, Download } from 'lucide-react';
import { EmailTemplate } from './types';
import { TemplateIcon } from './TemplateIcon';

interface TemplateSidebarProps {
  templates: EmailTemplate[];
  activeTemplateId: string;
  onTemplateChange: (template: EmailTemplate) => void;
  onCopy: () => void;
  onDownload: () => void;
  copySuccess: boolean;
}

export const TemplateSidebar = ({
  templates,
  activeTemplateId,
  onTemplateChange,
  onCopy,
  onDownload,
  copySuccess
}: TemplateSidebarProps) => {
  return (
    <aside className="w-full lg:w-72 bg-card border-r border-border flex flex-col h-full shrink-0">
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="gradient-primary p-2.5 rounded-xl shadow-glow">
          <Mail className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-foreground">EmailCraft</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Email Template Builder</p>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
          Templates
        </h2>
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 border-2 group ${
                activeTemplateId === t.id 
                  ? 'border-primary bg-accent shadow-soft' 
                  : 'border-transparent hover:bg-secondary/60 hover:border-border'
              }`}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: t.previewColor + '20', color: t.previewColor }}
                >
                  <TemplateIcon icon={t.icon} className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-foreground">{t.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 pl-11">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-secondary/30 border-t border-border space-y-2">
        <button 
          onClick={onCopy}
          className="w-full flex items-center justify-center gap-2 gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-soft hover:shadow-glow active:scale-[0.98]"
        >
          {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copySuccess ? 'Copied!' : 'Copy HTML'}
        </button>
        <button 
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 bg-card hover:bg-secondary border border-border text-foreground font-semibold py-3 px-4 rounded-xl transition-all shadow-soft active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          Download File
        </button>
      </div>
    </aside>
  );
};
