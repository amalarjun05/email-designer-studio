import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmailTemplates, SavedTemplate } from '@/hooks/useEmailTemplates';
import { EmailData } from './types';
import { 
  Cloud, 
  Loader2, 
  FolderOpen, 
  Trash2, 
  Edit3, 
  Save,
  X,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavedTemplatesPanelProps {
  currentData: EmailData;
  onLoad: (data: EmailData) => void;
}

export const SavedTemplatesPanel = ({ currentData, onLoad }: SavedTemplatesPanelProps) => {
  const { user, signOut } = useAuth();
  const { templates, loading, fetchTemplates, saveTemplate, updateTemplate, deleteTemplate } = useEmailTemplates();
  const [isOpen, setIsOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      fetchTemplates();
    }
  }, [user, isOpen, fetchTemplates]);

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    const success = await saveTemplate(templateName.trim(), currentData);
    if (success) {
      setTemplateName('');
      setSaveDialogOpen(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    const template = templates.find(t => t.id === id);
    if (template) {
      const success = await updateTemplate(id, editName.trim(), template.data);
      if (success) {
        setEditingId(null);
        setEditName('');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };

  const handleLoad = (template: SavedTemplate) => {
    onLoad(template.data);
    setIsOpen(false);
    toast.success(`Loaded "${template.name}"`);
  };

  if (!user) {
    return (
      <a 
        href="/auth" 
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign in to save to cloud
      </a>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{user.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-2">
        {/* Save to Cloud */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex-1 py-2 flex items-center justify-center gap-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
              <Cloud className="w-3.5 h-3.5" /> Save to Cloud
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Template name"
                className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-sm outline-none focus:ring-2 ring-primary/20"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <button
                onClick={handleSave}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                <Save className="w-4 h-4" /> Save Template
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Saved Templates */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex-1 py-2 flex items-center justify-center gap-2 text-xs font-semibold bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-all">
              <FolderOpen className="w-3.5 h-3.5" /> My Templates
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>My Saved Templates</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No saved templates yet
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 bg-secondary/50 rounded-xl border border-border group"
                    >
                      {editingId === template.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 p-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 ring-primary/20"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdate(template.id)}
                            className="p-2 bg-primary text-primary-foreground rounded-lg"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditName('');
                            }}
                            className="p-2 bg-secondary rounded-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleLoad(template)}
                          >
                            <h4 className="font-semibold text-sm">{template.name}</h4>
                            <p className="text-[10px] text-muted-foreground">
                              Updated {new Date(template.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingId(template.id);
                                setEditName(template.name);
                              }}
                              className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              title="Rename"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(template.id)}
                              className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
