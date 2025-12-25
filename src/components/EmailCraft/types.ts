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

export interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface EmailData {
  logo: string;
  title: string;
  body: string;
  buttons: EmailButton[];
  extraBlocks: ExtraBlock[];
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
