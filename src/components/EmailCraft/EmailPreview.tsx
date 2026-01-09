import { forwardRef } from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { EmailData, ContentBlock } from './types';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface EmailPreviewProps {
  data: EmailData;
  viewMode: ViewMode;
}

const fontFamilyMap: Record<string, string> = {
  'system': '-apple-system, BlinkMacSystemFont, sans-serif',
  'sans-serif': 'Arial, Helvetica, sans-serif',
  'serif': 'Georgia, Times, serif',
  'mono': 'Monaco, Consolas, monospace',
  'georgia': 'Georgia, serif',
  'arial': 'Arial, sans-serif',
  'times': '"Times New Roman", Times, serif',
};

const ContentBlockPreview = ({ block, accentColor }: { block: ContentBlock; accentColor: string }) => {
  switch (block.type) {
    case 'text':
      return (
        <p 
          className="text-muted-foreground leading-relaxed w-full"
          style={{
            fontWeight: block.textFormatting?.bold ? 'bold' : 'normal',
            fontStyle: block.textFormatting?.italic ? 'italic' : 'normal',
            textAlign: block.textFormatting?.align ?? 'left',
            fontFamily: fontFamilyMap[block.textFormatting?.fontFamily || 'system'],
            fontSize: `${block.textFormatting?.fontSize || 16}px`
          }}
        >
          {block.content}
        </p>
      );
    case 'image':
      if (!block.content) return null;
      return (
        <div className="flex justify-center w-full">
          <img
            src={block.content}
            alt="Content"
            className="h-auto object-contain shadow-soft"
            style={{
              transform: block.imageSettings ? `rotate(${block.imageSettings.rotation}deg)` : undefined,
              borderRadius: block.imageSettings ? `${block.imageSettings.borderRadius}px` : '12px',
              maxWidth: block.imageSettings ? `${block.imageSettings.size * 3}px` : '300px',
              width: '100%'
            }}
          />
        </div>
      );
    case 'button':
      return (
        <a
          href={block.link || '#'}
          className="px-8 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98] text-center w-fit min-w-[180px] text-sm"
          style={{ backgroundColor: accentColor }}
        >
          {block.content || 'Button'}
        </a>
      );
    case 'divider':
      return (
        <div className="w-full h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />
      );
    case 'spacer':
      return <div className="h-8" />;
    default:
      return null;
  }
};

export const EmailPreview = forwardRef<HTMLDivElement, EmailPreviewProps>(({ data, viewMode }, ref) => {
  const getWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[500px]';
      default:
        return 'w-full max-w-[600px]';
    }
  };

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-6 lg:p-10 flex justify-center custom-scrollbar">
      <div 
        className={`transition-all duration-500 ease-out shadow-elevated rounded-2xl overflow-hidden h-fit animate-scale-in ${getWidth()}`}
        style={{ backgroundColor: data.backgroundColor }}
      >
        <div className="bg-card min-h-full">
          <div className="p-8 lg:p-10 flex flex-col items-center text-center">
            {data.logo && (
              <img 
                src={data.logo} 
                alt="Logo" 
                className="object-contain mb-6 shadow-soft bg-secondary" 
                style={{
                  width: `${data.logoSettings.size}px`,
                  height: `${data.logoSettings.size}px`,
                  transform: `rotate(${data.logoSettings.rotation}deg)`,
                  borderRadius: `${data.logoSettings.borderRadius}px`
                }}
              />
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight">
              {data.title}
            </h1>
            <div 
              className="w-12 h-1 rounded-full mb-6" 
              style={{ backgroundColor: data.accentColor }} 
            />
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md text-sm lg:text-base">
              {data.body}
            </p>
            
            {/* Content Blocks Preview */}
            {data.contentBlocks.length > 0 && (
              <div className="w-full space-y-4 mb-6">
                {data.contentBlocks.map((block) => (
                  <div key={block.id} className="flex justify-center animate-fade-in">
                    <ContentBlockPreview block={block} accentColor={data.accentColor} />
                  </div>
                ))}
              </div>
            )}
            
            {/* Buttons Preview */}
            <div className="flex flex-col gap-3 w-full items-center">
              {data.buttons.map(btn => (
                <a 
                  key={btn.id}
                  href={btn.link}
                  className="px-8 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98] text-center w-fit min-w-[180px] text-sm"
                  style={{ backgroundColor: data.accentColor }}
                >
                  {btn.text}
                </a>
              ))}
            </div>

            {/* Extra Blocks Preview */}
            {data.extraBlocks.map(block => (
              <div 
                key={block.id} 
                className="mt-6 pt-6 border-t border-border w-full text-left animate-fade-in"
              >
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-secondary/50 border-t border-border text-center">
            <div className="flex justify-center gap-3 mb-4">
              {data.social.facebook && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-card shadow-soft">
                  <Facebook className="w-4 h-4" style={{ color: data.accentColor }} />
                </div>
              )}
              {data.social.twitter && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-card shadow-soft">
                  <Twitter className="w-4 h-4" style={{ color: data.accentColor }} />
                </div>
              )}
              {data.social.linkedin && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-card shadow-soft">
                  <Linkedin className="w-4 h-4" style={{ color: data.accentColor }} />
                </div>
              )}
              {data.social.instagram && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-card shadow-soft">
                  <Instagram className="w-4 h-4" style={{ color: data.accentColor }} />
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              {data.footer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

EmailPreview.displayName = 'EmailPreview';
