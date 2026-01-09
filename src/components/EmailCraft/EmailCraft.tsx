import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { EmailData, EmailTemplate, ContentBlockType, ImageSettings, ContentBlock, TextFormatting } from './types';
import { TEMPLATES } from './templates';
import { generateHTML } from './generateHTML';
import { TemplateSidebar } from './TemplateSidebar';
import { PreviewHeader } from './PreviewHeader';
import { EmailPreview } from './EmailPreview';
import { EditorSidebar } from './EditorSidebar';
import { uploadImage } from './useImageUpload';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

const STORAGE_KEY = 'emailcraft_saved_template';
const MAX_HISTORY = 50;

export const EmailCraft = () => {
  const [activeTemplateId, setActiveTemplateId] = useState(TEMPLATES[0].id);
  const [data, setData] = useState<EmailData>(TEMPLATES[0].structure);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasSavedTemplate, setHasSavedTemplate] = useState(false);
  
  // Undo/Redo state
  const historyRef = useRef<EmailData[]>([TEMPLATES[0].structure]);
  const historyIndexRef = useRef(0);
  const isInternalUpdateRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    setHasSavedTemplate(!!localStorage.getItem(STORAGE_KEY));
  }, []);

  // Update undo/redo availability
  const updateUndoRedoState = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // Push state to history
  const pushToHistory = useCallback((newData: EmailData) => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    // Remove any redo states
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    
    // Add new state
    historyRef.current.push(JSON.parse(JSON.stringify(newData)));
    
    // Limit history size
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(-MAX_HISTORY);
    }
    
    historyIndexRef.current = historyRef.current.length - 1;
    updateUndoRedoState();
  }, [updateUndoRedoState]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    
    historyIndexRef.current -= 1;
    isInternalUpdateRef.current = true;
    const previousState = historyRef.current[historyIndexRef.current];
    setData(JSON.parse(JSON.stringify(previousState)));
    updateUndoRedoState();
    toast.info('Undo');
  }, [updateUndoRedoState]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    
    historyIndexRef.current += 1;
    isInternalUpdateRef.current = true;
    const nextState = historyRef.current[historyIndexRef.current];
    setData(JSON.parse(JSON.stringify(nextState)));
    updateUndoRedoState();
    toast.info('Redo');
  }, [updateUndoRedoState]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleTemplateChange = (template: EmailTemplate) => {
    setActiveTemplateId(template.id);
    const newData = template.structure;
    setData(newData);
    // Reset history when changing templates
    historyRef.current = [JSON.parse(JSON.stringify(newData))];
    historyIndexRef.current = 0;
    updateUndoRedoState();
    toast.success(`Template "${template.name}" loaded`);
  };

  const updateData = (field: keyof EmailData, value: any) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      pushToHistory(newData);
      return newData;
    });
  };

  const updateLogoSettings = (settings: ImageSettings) => {
    setData(prev => {
      const newData = { ...prev, logoSettings: settings };
      pushToHistory(newData);
      return newData;
    });
  };

  // Logo upload handler
  const handleLogoUpload = async (file: File) => {
    const url = await uploadImage(file);
    if (url) {
      updateData('logo', url);
    }
  };

  const addButton = () => {
    const newBtn = { id: Date.now(), text: 'New Button', link: '#', primary: false };
    setData(prev => {
      const newData = { ...prev, buttons: [...prev.buttons, newBtn] };
      pushToHistory(newData);
      return newData;
    });
  };

  const removeButton = (id: number) => {
    if (data.buttons.length <= 1) {
      toast.error('At least one button is required');
      return;
    }
    setData(prev => {
      const newData = { ...prev, buttons: prev.buttons.filter(b => b.id !== id) };
      pushToHistory(newData);
      return newData;
    });
  };

  const updateButton = (id: number, field: string, value: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        buttons: prev.buttons.map(b => b.id === id ? { ...b, [field]: value } : b)
      };
      pushToHistory(newData);
      return newData;
    });
  };

  const moveButton = (id: number, direction: 'up' | 'down') => {
    setData(prev => {
      const buttons = [...prev.buttons];
      const index = buttons.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= buttons.length) return prev;
      
      [buttons[index], buttons[newIndex]] = [buttons[newIndex], buttons[index]];
      const newData = { ...prev, buttons };
      pushToHistory(newData);
      return newData;
    });
  };

  const addExtraBlock = () => {
    const newBlock = { id: Date.now(), text: 'Additional content goes here...' };
    setData(prev => {
      const newData = { ...prev, extraBlocks: [...prev.extraBlocks, newBlock] };
      pushToHistory(newData);
      return newData;
    });
  };

  const removeExtraBlock = (id: number) => {
    setData(prev => {
      const newData = { ...prev, extraBlocks: prev.extraBlocks.filter(b => b.id !== id) };
      pushToHistory(newData);
      return newData;
    });
  };

  const updateExtraBlock = (id: number, value: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        extraBlocks: prev.extraBlocks.map(b => b.id === id ? { ...b, text: value } : b)
      };
      pushToHistory(newData);
      return newData;
    });
  };

  const moveExtraBlock = (id: number, direction: 'up' | 'down') => {
    setData(prev => {
      const extraBlocks = [...prev.extraBlocks];
      const index = extraBlocks.findIndex(b => b.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= extraBlocks.length) return prev;
      
      [extraBlocks[index], extraBlocks[newIndex]] = [extraBlocks[newIndex], extraBlocks[index]];
      const newData = { ...prev, extraBlocks };
      pushToHistory(newData);
      return newData;
    });
  };

  const updateSocial = (platform: string, value: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        social: { ...prev.social, [platform]: value }
      };
      pushToHistory(newData);
      return newData;
    });
  };

  // Content Block handlers
  const addContentBlock = (type: ContentBlockType) => {
    const defaultImageSettings: ImageSettings = {
      size: 100,
      rotation: 0,
      borderRadius: 12
    };

    const defaultTextFormatting: TextFormatting = {
      bold: false,
      italic: false,
      align: 'left',
      fontFamily: 'system',
      fontSize: 16
    };

    const newBlock: ContentBlock = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'Enter your text here...' : 
               type === 'button' ? 'Click Me' : '',
      link: type === 'button' ? '#' : undefined,
      imageSettings: type === 'image' ? defaultImageSettings : undefined,
      textFormatting: type === 'text' ? defaultTextFormatting : undefined
    };
    setData(prev => {
      const newData = { ...prev, contentBlocks: [...prev.contentBlocks, newBlock] };
      pushToHistory(newData);
      return newData;
    });
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} block added`);
  };

  const removeContentBlock = (id: number) => {
    setData(prev => {
      const newData = { ...prev, contentBlocks: prev.contentBlocks.filter(b => b.id !== id) };
      pushToHistory(newData);
      return newData;
    });
  };

  const updateContentBlock = (id: number, field: string, value: any) => {
    setData(prev => {
      const newData = {
        ...prev,
        contentBlocks: prev.contentBlocks.map(b => 
          b.id === id ? { ...b, [field]: value } : b
        )
      };
      pushToHistory(newData);
      return newData;
    });
  };

  const reorderContentBlocks = (newBlocks: ContentBlock[]) => {
    setData(prev => {
      const newData = { ...prev, contentBlocks: newBlocks };
      pushToHistory(newData);
      return newData;
    });
  };

  // Save/Load handlers
  const saveTemplate = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setHasSavedTemplate(true);
    toast.success('Template saved to browser storage!');
  };

  const loadTemplate = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setActiveTemplateId('custom');
        historyRef.current = [JSON.parse(JSON.stringify(parsed))];
        historyIndexRef.current = 0;
        updateUndoRedoState();
        toast.success('Saved template loaded!');
      } catch (e) {
        toast.error('Failed to load saved template');
      }
    }
  };

  const importTemplate = (importedData: EmailData) => {
    setData(importedData);
    setActiveTemplateId('custom');
    historyRef.current = [JSON.parse(JSON.stringify(importedData))];
    historyIndexRef.current = 0;
    updateUndoRedoState();
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

  const exportTemplateJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template JSON exported!');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground font-sans overflow-hidden">
      <TemplateSidebar
        templates={TEMPLATES}
        activeTemplateId={activeTemplateId}
        onTemplateChange={handleTemplateChange}
        onCopy={copyToClipboard}
        onDownload={downloadHTML}
        onSave={saveTemplate}
        onLoad={loadTemplate}
        onImport={importTemplate}
        copySuccess={copySuccess}
        hasSavedTemplate={hasSavedTemplate}
      />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PreviewHeader 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
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
        moveButton={moveButton}
        addExtraBlock={addExtraBlock}
        removeExtraBlock={removeExtraBlock}
        updateExtraBlock={updateExtraBlock}
        moveExtraBlock={moveExtraBlock}
        updateSocial={updateSocial}
        addContentBlock={addContentBlock}
        removeContentBlock={removeContentBlock}
        updateContentBlock={updateContentBlock}
        reorderContentBlocks={reorderContentBlocks}
        updateLogoSettings={updateLogoSettings}
        onLogoUpload={handleLogoUpload}
      />
    </div>
  );
};
