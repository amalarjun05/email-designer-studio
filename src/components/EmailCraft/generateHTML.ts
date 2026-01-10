import { EmailData } from './types';

export const generateHTML = (data: EmailData): string => {
  const fontFamilyMap: Record<string, string> = {
    'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    'sans-serif': 'Arial, Helvetica, sans-serif',
    'serif': 'Georgia, Times, serif',
    'mono': 'Monaco, Consolas, monospace',
    'georgia': 'Georgia, serif',
    'arial': 'Arial, sans-serif',
    'times': '"Times New Roman", Times, serif',
  };

  // Generate content blocks HTML - Table-based for email client compatibility
  const contentBlocksHtml = data.contentBlocks.map(block => {
    switch (block.type) {
      case 'text':
        const textAlign = block.textFormatting?.align ?? 'left';
        const fontWeight = block.textFormatting?.bold ? 'font-weight: bold;' : 'font-weight: normal;';
        const fontStyle = block.textFormatting?.italic ? 'font-style: italic;' : 'font-style: normal;';
        const fontFamily = fontFamilyMap[block.textFormatting?.fontFamily || 'system'];
        const fontSize = block.textFormatting?.fontSize || 16;
        return `
      <tr>
        <td align="${textAlign}" style="padding: 10px 0;">
          <p style="margin: 0; font-size: ${fontSize}px; color: #374151; line-height: 1.7; text-align: ${textAlign}; font-family: ${fontFamily}; ${fontWeight} ${fontStyle} mso-line-height-rule: exactly;">${block.content.replace(/\n/g, '<br>')}</p>
        </td>
      </tr>`;
      case 'image':
        if (!block.content) return '';
        const imgWidth = block.imageSettings ? Math.min(block.imageSettings.size * 3, 560) : 300;
        const imgRadius = block.imageSettings?.borderRadius || 12;
        return `
      <tr>
        <td align="center" style="padding: 16px 0;">
          <img src="${block.content}" alt="Content" width="${imgWidth}" style="display: block; max-width: 100%; height: auto; border-radius: ${imgRadius}px; border: 0; outline: none; text-decoration: none;" />
        </td>
      </tr>`;
      case 'button':
        return `
      <tr>
        <td align="center" style="padding: 16px 0;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${block.link || '#'}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="25%" stroke="f" fillcolor="${data.accentColor}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${block.content || 'Button'}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${block.link || '#'}" style="display: inline-block; background-color: ${data.accentColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; font-family: Arial, sans-serif; mso-padding-alt: 0; text-align: center;">
            <!--<![endif]-->
            ${block.content || 'Button'}
            <!--[if !mso]><!-->
          </a>
          <!--<![endif]-->
        </td>
      </tr>`;
      case 'divider':
        return `
      <tr>
        <td align="center" style="padding: 24px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="border-top: 2px solid ${data.accentColor}; font-size: 0; line-height: 0; height: 2px;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>`;
      case 'spacer':
        return `
      <tr>
        <td style="height: 32px; font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>`;
      default:
        return '';
    }
  }).join('');

  // Buttons HTML - Table-based
  const buttonsHtml = data.buttons.map(btn => `
      <tr>
        <td align="center" style="padding: 12px 0;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${btn.link}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="25%" stroke="f" fillcolor="${data.accentColor}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${btn.text}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${btn.link}" style="display: inline-block; background-color: ${data.accentColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; font-family: Arial, sans-serif; mso-padding-alt: 0; text-align: center;">
            <!--<![endif]-->
            ${btn.text}
            <!--[if !mso]><!-->
          </a>
          <!--<![endif]-->
        </td>
      </tr>`).join('');

  // Extra blocks HTML
  const extraHtml = data.extraBlocks.map(block => `
      <tr>
        <td style="padding-top: 24px; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0; font-size: 14px; color: #6B7280; font-style: italic; line-height: 1.6; font-family: Arial, sans-serif;">${block.text.replace(/\n/g, '<br>')}</p>
        </td>
      </tr>`).join('');

  // Social links HTML
  const socialHtml = Object.entries(data.social)
    .filter(([_, link]) => link)
    .map(([name, link]) => `<a href="${link}" style="display: inline-block; margin: 0 8px; color: ${data.accentColor}; text-decoration: none; font-weight: 600; text-transform: capitalize; font-size: 13px; font-family: Arial, sans-serif;">${name}</a>`)
    .join(' ');

  const logoSize = data.logoSettings.size;
  const logoBorderRadius = data.logoSettings.borderRadius;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${data.title}</title>
  <!--[if !mso]><!-->
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; padding: 20px !important; }
      .content-cell { padding: 0 20px !important; }
      img { max-width: 100% !important; height: auto !important; }
    }
  </style>
  <!--<![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${data.backgroundColor}; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  
  <!-- Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${data.backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 48px 40px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <img src="${data.logo}" alt="Logo" width="${logoSize}" height="${logoSize}" style="display: block; border-radius: ${logoBorderRadius}px; object-fit: cover;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 24px;">
                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #111827; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">${data.title}</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: ${data.accentColor}; border-radius: 2px; height: 4px; width: 48px;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding: 0 40px 48px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; color: #374151; font-family: Arial, Helvetica, sans-serif;">${data.body.replace(/\n/g, '<br>')}</p>
                  </td>
                </tr>
                ${contentBlocksHtml}
                ${buttonsHtml}
                ${extraHtml}
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                ${socialHtml ? `
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    ${socialHtml}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6B7280; font-family: Arial, Helvetica, sans-serif;">${data.footer.replace(/\n/g, '<br>')}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        <!-- End Main Container -->
        
      </td>
    </tr>
  </table>
  <!-- End Wrapper Table -->
  
</body>
</html>`;
};
