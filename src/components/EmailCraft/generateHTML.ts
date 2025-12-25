import { EmailData } from './types';

export const generateHTML = (data: EmailData): string => {
  const buttonsHtml = data.buttons.map(btn => `
      <div style="margin: 12px 0;">
        <a href="${btn.link}" style="display: inline-block; background-color: ${data.accentColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px;">${btn.text}</a>
      </div>
    `).join('');

  const extraHtml = data.extraBlocks.map(block => `
      <p style="margin-top: 24px; font-size: 14px; color: #6B7280; border-top: 1px solid #f3f4f6; padding-top: 24px; font-style: italic;">${block.text}</p>
    `).join('');

  const socialHtml = Object.entries(data.social)
    .filter(([_, link]) => link)
    .map(([name, link]) => `
        <a href="${link}" style="display: inline-block; margin: 0 8px; color: ${data.accentColor}; text-decoration: none; font-weight: 600; text-transform: capitalize; font-size: 13px;">${name}</a>
      `).join(' ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      background-color: ${data.backgroundColor}; 
      margin: 0; 
      padding: 0; 
      -webkit-font-smoothing: antialiased;
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border-radius: 16px; 
      overflow: hidden; 
      box-shadow: 0 4px 24px rgba(0,0,0,0.08); 
    }
    .header { 
      padding: 48px 40px 32px; 
      text-align: center; 
    }
    .logo { 
      max-width: 80px; 
      border-radius: 16px; 
      margin-bottom: 24px; 
    }
    .divider {
      width: 48px;
      height: 4px;
      background-color: ${data.accentColor};
      border-radius: 2px;
      margin: 16px auto 24px;
    }
    .content { 
      padding: 0 40px 48px; 
      text-align: center; 
      color: #374151; 
    }
    h1 { 
      color: #111827; 
      font-size: 28px; 
      margin: 0;
      line-height: 1.3;
    }
    p { 
      line-height: 1.7; 
      margin: 0 0 24px;
      font-size: 15px;
    }
    .footer { 
      padding: 32px; 
      background: #F9FAFB; 
      text-align: center; 
      font-size: 12px; 
      color: #6B7280; 
      border-top: 1px solid #E5E7EB; 
    }
    .social-links {
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${data.logo}" alt="Logo" class="logo">
      <h1>${data.title}</h1>
      <div class="divider"></div>
    </div>
    <div class="content">
      <p>${data.body}</p>
      ${buttonsHtml}
      ${extraHtml}
    </div>
    <div class="footer">
      <div class="social-links">${socialHtml}</div>
      ${data.footer}
    </div>
  </div>
</body>
</html>`;
};
