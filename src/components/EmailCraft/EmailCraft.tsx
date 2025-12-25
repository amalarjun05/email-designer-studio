import { useState } from 'react';
import { toast } from 'sonner';
import { EmailData, EmailTemplate, ContentBlockType, ImageSettings, ContentBlock } from './types';
import { TEMPLATES } from './templates';
import { generateHTML } from './generateHTML';
import { TemplateSidebar } from './TemplateSidebar';
import { PreviewHeader } from './PreviewHeader';
import { EmailPreview } from './EmailPreview';
import { EditorSidebar } from './EditorSidebar';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export const EmailCraft = () => {
  const [activeTemplateId, setActiveTemplateId] = useState(TEMPLATES[0].id);
  const [data, setData] = useState<EmailData>(TEMPLATES[0].structure);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleTemplateChange = (template: EmailTemplate) => {
    setActiveTemplateId(template.id);
    setData(template.structure);
    toast.success(`Template "${template.name}" loaded`);
  };

  const updateData = (field: keyof EmailData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateLogoSettings = (settings: ImageSettings) => {
    setData(prev => ({ ...prev, logoSettings: settings }));
  };

  const addButton = () => {
    const newBtn = { id: Date.now(), text: 'New Button', link: '#', primary: false };
    setData(prev => ({ ...prev, buttons: [...prev.buttons, newBtn] }));
  };

  const removeButton = (id: number) => {
    if (data.buttons.length <= 1) {
      toast.error('At least one button is required');
      return;
    }
    setData(prev => ({ ...prev, buttons: prev.buttons.filter(b => b.id !== id) }));
  };

  const updateButton = (id: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      buttons: prev.buttons.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const addExtraBlock = () => {
    const newBlock = { id: Date.now(), text: 'Additional content goes here...' };
    setData(prev => ({ ...prev, extraBlocks: [...prev.extraBlocks, newBlock] }));
  };

  const removeExtraBlock = (id: number) => {
    setData(prev => ({ ...prev, extraBlocks: prev.extraBlocks.filter(b => b.id !== id) }));
  };

  const updateExtraBlock = (id: number, value: string) => {
    setData(prev => ({
      ...prev,
      extraBlocks: prev.extraBlocks.map(b => b.id === id ? { ...b, text: value } : b)
    }));
  };

  const updateSocial = (platform: string, value: string) => {
    setData(prev => ({
      ...prev,
      social: { ...prev.social, [platform]: value }
    }));
  };

  // Content Block handlers
  const addContentBlock = (type: ContentBlockType) => {
    const defaultImageSettings: ImageSettings = {
      size: 100,
      rotation: 0,
      borderRadius: 12
    };

    const newBlock: ContentBlock = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'Enter your text here...' : 
               type === 'button' ? 'Click Me' : '',
      link: type === 'button' ? '#' : undefined,
      imageSettings: type === 'image' ? defaultImageSettings : undefined
    };
    setData(prev => ({ ...prev, contentBlocks: [...prev.contentBlocks, newBlock] }));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} block added`);
  };

  const removeContentBlock = (id: number) => {
    setData(prev => ({ ...prev, contentBlocks: prev.contentBlocks.filter(b => b.id !== id) }));
  };

  const updateContentBlock = (id: number, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(b => 
        b.id === id ? { ...b, [field]: value } : b
      )
    }));
  };

  const moveContentBlock = (id: number, direction: 'up' | 'down') => {
    setData(prev => {
      const blocks = [...prev.contentBlocks];
      const index = blocks.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return prev;
      
      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
      return { ...prev, contentBlocks: blocks };
    });
  };

  const copyToClipboard = async () => {
    const html = generateHTML(data);
    try {
      await navigator.clipboard.writeText(html);
      setCopySuccess(true);
      toast.success('HTML copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = html;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        toast.success('HTML copied to clipboard!');
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (e) {
        toast.error('Failed to copy');
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadHTML = () => {
    const html = generateHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_email.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML file downloaded!');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground font-sans overflow-hidden">
      <TemplateSidebar
        templates={TEMPLATES}
        activeTemplateId={activeTemplateId}
        onTemplateChange={handleTemplateChange}
        onCopy={copyToClipboard}
        onDownload={downloadHTML}
        copySuccess={copySuccess}
      />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PreviewHeader 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
        <EmailPreview 
          data={data} 
          viewMode={viewMode} 
        />
      </main>

      <EditorSidebar
        data={data}
        updateData={updateData}
        addButton={addButton}
        removeButton={removeButton}
        updateButton={updateButton}
        addExtraBlock={addExtraBlock}
        removeExtraBlock={removeExtraBlock}
        updateExtraBlock={updateExtraBlock}
        updateSocial={updateSocial}
        addContentBlock={addContentBlock}
        removeContentBlock={removeContentBlock}
        updateContentBlock={updateContentBlock}
        moveContentBlock={moveContentBlock}
        updateLogoSettings={updateLogoSettings}
      />
    </div>
  );
};
