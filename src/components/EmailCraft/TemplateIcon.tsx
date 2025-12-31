import { Sparkles, Newspaper, Tag, Calendar, Rocket, Heart, Plus } from 'lucide-react';

interface TemplateIconProps {
  icon: string;
  className?: string;
}

export const TemplateIcon = ({ icon, className = "w-4 h-4" }: TemplateIconProps) => {
  switch (icon) {
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'newspaper':
      return <Newspaper className={className} />;
    case 'tag':
      return <Tag className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'plus':
      return <Plus className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
