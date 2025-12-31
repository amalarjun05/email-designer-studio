import { EmailTemplate, ColorPalette, ImageSettings } from './types';

const defaultLogoSettings: ImageSettings = {
  size: 80,
  rotation: 0,
  borderRadius: 16
};

export const TEMPLATES: EmailTemplate[] = [
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Create your own email template from a blank canvas.',
    previewColor: '#71717A',
    icon: 'plus',
    structure: {
      logo: '',
      logoSettings: { ...defaultLogoSettings },
      title: 'Your Title Here',
      body: 'Start typing your email content here...',
      buttons: [],
      extraBlocks: [],
      contentBlocks: [],
      social: { facebook: '', twitter: '', linkedin: '', instagram: '' },
      footer: 'Your Company • Unsubscribe',
      accentColor: '#6366F1',
      backgroundColor: '#FFFFFF'
    }
  },
  {
    id: 'welcome',
    name: 'Welcome Series',
    description: 'Clean and friendly greeting for new subscribers.',
    previewColor: '#6366F1',
    icon: 'sparkles',
    structure: {
      logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop',
      logoSettings: { ...defaultLogoSettings },
      title: 'Welcome to the Community!',
      body: 'We are thrilled to have you here. Our mission is to provide you with the best experience possible. To get started, check out our quick-start guide below.',
      buttons: [
        { id: Date.now(), text: 'Get Started', link: '#', primary: true }
      ],
      extraBlocks: [],
      contentBlocks: [],
      social: { facebook: '', twitter: '', linkedin: '', instagram: '' },
      footer: '123 Business St, Tech City • Unsubscribe',
      accentColor: '#6366F1',
      backgroundColor: '#F5F5FF'
    }
  },
  {
    id: 'newsletter',
    name: 'Monthly Newsletter',
    description: 'Content-heavy layout for updates and articles.',
    previewColor: '#10B981',
    icon: 'newspaper',
    structure: {
      logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
      logoSettings: { ...defaultLogoSettings },
      title: 'The Monthly Digest',
      body: 'This month we explored new ways to improve productivity and remote collaboration.',
      buttons: [
        { id: Date.now(), text: 'Read Full Story', link: '#', primary: true }
      ],
      extraBlocks: [
        { id: Date.now() + 1, text: 'Did you know? Teams using collaborative tools report a 25% increase in efficiency.' }
      ],
      contentBlocks: [],
      social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '' },
      footer: 'Stay connected with us on social media.',
      accentColor: '#10B981',
      backgroundColor: '#ECFDF5'
    }
  },
  {
    id: 'promotional',
    name: 'Promotional Offer',
    description: 'Eye-catching design for sales and promotions.',
    previewColor: '#F59E0B',
    icon: 'tag',
    structure: {
      logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=100&fit=crop',
      logoSettings: { ...defaultLogoSettings },
      title: '🎉 Exclusive 50% Off Sale!',
      body: 'For a limited time only, enjoy half off on all our premium products. This offer won\'t last long – grab your favorites before they\'re gone!',
      buttons: [
        { id: Date.now(), text: 'Shop Now', link: '#', primary: true },
        { id: Date.now() + 1, text: 'View All Deals', link: '#', primary: false }
      ],
      extraBlocks: [
        { id: Date.now() + 2, text: 'Use code SAVE50 at checkout. Valid until end of month.' }
      ],
      contentBlocks: [],
      social: { facebook: '#', twitter: '#', linkedin: '', instagram: '#' },
      footer: 'Terms and conditions apply. Cannot be combined with other offers.',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFBEB'
    }
  },
  {
    id: 'event',
    name: 'Event Invitation',
    description: 'Elegant invitation for webinars and events.',
    previewColor: '#8B5CF6',
    icon: 'calendar',
    structure: {
      logo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop',
      logoSettings: { ...defaultLogoSettings },
      title: 'You\'re Invited! 🎤',
      body: 'Join us for an exclusive virtual summit featuring industry leaders discussing the future of technology. Don\'t miss this opportunity to learn, network, and grow.',
      buttons: [
        { id: Date.now(), text: 'Register Now', link: '#', primary: true },
        { id: Date.now() + 1, text: 'Add to Calendar', link: '#', primary: false }
      ],
      extraBlocks: [
        { id: Date.now() + 2, text: '📅 Date: January 15, 2025 | ⏰ Time: 2:00 PM EST | 📍 Virtual Event' }
      ],
      contentBlocks: [],
      social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '' },
      footer: 'Limited spots available. Register today to secure your seat.',
      accentColor: '#8B5CF6',
      backgroundColor: '#FAF5FF'
    }
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Announce new products with style.',
    previewColor: '#EC4899',
    icon: 'rocket',
    structure: {
      logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      logoSettings: { ...defaultLogoSettings },
      title: 'Introducing Our Latest Innovation ✨',
      body: 'We\'ve been working on something special, and it\'s finally here. Meet our newest product – designed to make your life easier and more enjoyable.',
      buttons: [
        { id: Date.now(), text: 'Discover Now', link: '#', primary: true }
      ],
      extraBlocks: [
        { id: Date.now() + 1, text: 'Early adopters get 20% off + free shipping on their first order.' }
      ],
      contentBlocks: [],
      social: { facebook: '#', twitter: '#', linkedin: '', instagram: '#' },
      footer: 'Be the first to experience the future.',
      accentColor: '#EC4899',
      backgroundColor: '#FDF2F8'
    }
  },
  {
    id: 'thank-you',
    name: 'Thank You Note',
    description: 'Express gratitude to your customers.',
    previewColor: '#14B8A6',
    icon: 'heart',
    structure: {
      logo: 'https://images.unsplash.com/photo-1586717799252-bd134f5c106c?w=100&h=100&fit=crop',
      logoSettings: { ...defaultLogoSettings },
      title: 'Thank You for Your Purchase! 💖',
      body: 'Your order is confirmed and on its way. We truly appreciate your trust in us. If you have any questions, our support team is always here to help.',
      buttons: [
        { id: Date.now(), text: 'Track Order', link: '#', primary: true },
        { id: Date.now() + 1, text: 'Contact Support', link: '#', primary: false }
      ],
      extraBlocks: [],
      contentBlocks: [],
      social: { facebook: '#', twitter: '', linkedin: '', instagram: '#' },
      footer: 'Questions? Reply to this email or visit our help center.',
      accentColor: '#14B8A6',
      backgroundColor: '#F0FDFA'
    }
  }
];

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'indigo', name: 'Indigo', accent: '#6366F1', background: '#F5F5FF' },
  { id: 'emerald', name: 'Emerald', accent: '#10B981', background: '#ECFDF5' },
  { id: 'amber', name: 'Amber', accent: '#F59E0B', background: '#FFFBEB' },
  { id: 'violet', name: 'Violet', accent: '#8B5CF6', background: '#FAF5FF' },
  { id: 'rose', name: 'Rose', accent: '#EC4899', background: '#FDF2F8' },
  { id: 'teal', name: 'Teal', accent: '#14B8A6', background: '#F0FDFA' },
  { id: 'sky', name: 'Sky', accent: '#0EA5E9', background: '#F0F9FF' },
  { id: 'slate', name: 'Slate', accent: '#475569', background: '#F8FAFC' },
];
