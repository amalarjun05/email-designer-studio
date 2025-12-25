import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { EmailData } from './types';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface EmailPreviewProps {
  data: EmailData;
  viewMode: ViewMode;
}

export const EmailPreview = ({ data, viewMode }: EmailPreviewProps) => {
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
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex justify-center custom-scrollbar">
      <div 
        className={`transition-all duration-500 ease-out shadow-elevated rounded-2xl overflow-hidden h-fit animate-scale-in ${getWidth()}`}
        style={{ backgroundColor: data.backgroundColor }}
      >
        <div className="bg-card min-h-full">
          <div className="p-8 lg:p-10 flex flex-col items-center text-center">
            <img 
              src={data.logo} 
              alt="Logo" 
              className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-2xl mb-6 shadow-soft bg-secondary" 
            />
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
};
