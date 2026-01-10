import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EmailData } from '@/components/EmailCraft/types';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface SavedTemplate {
  id: string;
  name: string;
  data: EmailData;
  created_at: string;
  updated_at: string;
}

export const useEmailTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []).map(t => ({
        id: t.id,
        name: t.name,
        data: t.data as unknown as EmailData,
        created_at: t.created_at,
        updated_at: t.updated_at
      })));
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveTemplate = useCallback(async (name: string, data: EmailData): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to save templates');
      return null;
    }

    try {
      const { data: newTemplate, error } = await supabase
        .from('email_templates')
        .insert({
          user_id: user.id,
          name,
          data: data as unknown as Json
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Template saved to cloud!');
      await fetchTemplates();
      return newTemplate.id;
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
      return null;
    }
  }, [user, fetchTemplates]);

  const updateTemplate = useCallback(async (id: string, name: string, data: EmailData): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to update templates');
      return false;
    }

    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          name,
          data: data as unknown as Json
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Template updated!');
      await fetchTemplates();
      return true;
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      return false;
    }
  }, [user, fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please sign in to delete templates');
      return false;
    }

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Template deleted!');
      await fetchTemplates();
      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    }
  }, [user, fetchTemplates]);

  return {
    templates,
    loading,
    fetchTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate
  };
};
