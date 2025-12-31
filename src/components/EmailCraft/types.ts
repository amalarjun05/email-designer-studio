export interface EmailButton {
  id: number;
  text: string;
  link: string;
  primary: boolean;
}

export interface ExtraBlock {
  id: number;
  text: string;
}

export interface ImageSettings {
  size: number;
  rotation: number;
  borderRadius: number;
}

export type ContentBlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer';

export type TextAlign = 'left' | 'center' | 'right';

export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  align: TextAlign;
}

export interface ContentBlock {
  id: number;
  type: ContentBlockType;
  content: string;
  link?: string;
  imageSettings?: ImageSettings;
  textFormatting?: TextFormatting;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface EmailData {
  logo: string;
  logoSettings: ImageSettings;
  title: string;
  body: string;
  buttons: EmailButton[];
  extraBlocks: ExtraBlock[];
  contentBlocks: ContentBlock[];
  social: SocialLinks;
  footer: string;
  accentColor: string;
  backgroundColor: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  icon: string;
  structure: EmailData;
}

export interface ColorPalette {
  id: string;
  name: string;
  accent: string;
  background: string;
}
