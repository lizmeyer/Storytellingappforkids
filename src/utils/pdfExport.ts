import jsPDF from 'jspdf';
import { StoryAnswer } from '../types/story';

interface ExportOptions {
  title: string;
  story: string;
  characterDrawing?: string;
  settingDrawing?: string;
  answers: StoryAnswer[];
}

export async function exportStoryAsPDF(options: ExportOptions): Promise<void> {
  const { title, story, characterDrawing, settingDrawing, answers } = options;
  
  // Create new PDF (A4 size)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper to check if we need a new page
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to add wrapped text
  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', align: 'left' | 'center' = 'left') => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(fontSize);
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak(fontSize / 2);
      
      if (align === 'center') {
        const textWidth = pdf.getTextWidth(line);
        pdf.text(line, (pageWidth - textWidth) / 2, yPosition);
      } else {
        pdf.text(line, margin, yPosition);
      }
      
      yPosition += fontSize / 2;
    });
  };

  // Helper to add image
  const addImage = async (imageData: string, caption?: string) => {
    try {
      // Check if we need a new page for the image
      checkPageBreak(80);

      if (caption) {
        addText(caption, 10, 'normal', 'center');
        yPosition += 3;
      }

      // Add image (centered, max width 120mm)
      const imgWidth = 120;
      const imgHeight = 80;
      const xPosition = (pageWidth - imgWidth) / 2;
      
      pdf.addImage(imageData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error('Error adding image to PDF:', error);
    }
  };

  // === COVER PAGE ===
  // Title area with decorative background
  pdf.setFillColor(147, 51, 234); // Purple
  pdf.rect(0, 0, pageWidth, 80, 'F');
  
  // Story title
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  const titleLines = pdf.splitTextToSize(title, contentWidth - 20);
  let titleY = 35;
  titleLines.forEach((line: string) => {
    const textWidth = pdf.getTextWidth(line);
    pdf.text(line, (pageWidth - textWidth) / 2, titleY);
    titleY += 12;
  });

  // Author
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Written by You', pageWidth / 2, titleY + 5, { align: 'center' });

  // Decorative elements
  pdf.setFontSize(24);
  const emojis = ['⭐', '✨', '🌟', '💫'];
  let emojiX = 40;
  emojis.forEach(emoji => {
    pdf.text(emoji, emojiX, 100);
    emojiX += 30;
  });

  // Date
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.text(`Created on ${date}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Reset text color for story content
  pdf.setTextColor(0, 0, 0);

  // === STORY CONTENT ===
  pdf.addPage();
  yPosition = margin;

  // Character drawing (if exists)
  if (characterDrawing) {
    await addImage(characterDrawing, 'The Character');
    yPosition += 5;
  }

  // Story text
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  const paragraphs = story.split('\n\n');
  
  paragraphs.forEach((paragraph, index) => {
    if (paragraph.trim()) {
      // Add spacing between paragraphs
      if (index > 0) {
        yPosition += 5;
      }
      
      const lines = pdf.splitTextToSize(paragraph, contentWidth);
      
      lines.forEach((line: string) => {
        checkPageBreak(8);
        pdf.text(line, margin, yPosition);
        yPosition += 7;
      });
    }
  });

  // Setting drawing (if exists)
  if (settingDrawing) {
    yPosition += 10;
    await addImage(settingDrawing, 'The Setting');
  }

  // === BONUS: Additional drawings page ===
  const allDrawings = answers.filter(a => a.drawing && a.drawing !== characterDrawing && a.drawing !== settingDrawing);
  
  if (allDrawings.length > 0) {
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Your Amazing Artwork', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    for (const answer of allDrawings) {
      if (answer.drawing) {
        // Add question as caption
        const caption = answer.question.replace('✨ ', '');
        await addImage(answer.drawing, caption);
      }
    }
  }

  // === BACK PAGE ===
  pdf.addPage();
  yPosition = pageHeight / 2 - 30;
  
  pdf.setFillColor(252, 231, 243); // Light pink background
  pdf.rect(0, yPosition - 20, pageWidth, 80, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(147, 51, 234); // Purple
  pdf.text('✨ Keep Writing! ✨', pageWidth / 2, yPosition, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  yPosition += 12;
  pdf.text('Every story you create makes you a better writer.', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;
  pdf.text('What adventure will you imagine next?', pageWidth / 2, yPosition, { align: 'center' });

  // Save the PDF
  const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
  pdf.save(fileName);
}

// Alternative: Export as HTML file
export function exportStoryAsHTML(options: ExportOptions): void {
  const { title, story, characterDrawing, settingDrawing, answers } = options;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      background: linear-gradient(135deg, #f5e6ff 0%, #ffe6f0 50%, #fff9e6 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
      padding: 60px;
    }
    .cover {
      text-align: center;
      padding: 40px 0;
      border-bottom: 3px solid #9333ea;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 2.5em;
      color: #9333ea;
      margin-bottom: 20px;
    }
    .author {
      font-size: 1.2em;
      color: #666;
      font-style: italic;
    }
    .date {
      font-size: 0.9em;
      color: #999;
      margin-top: 10px;
    }
    .illustration {
      text-align: center;
      margin: 30px 0;
    }
    .illustration img {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .illustration-caption {
      font-size: 0.9em;
      color: #666;
      margin-top: 10px;
      font-style: italic;
    }
    .story-content {
      font-size: 1.1em;
      color: #333;
    }
    .story-content p {
      margin-bottom: 20px;
      text-align: justify;
    }
    .footer {
      text-align: center;
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #ffe6f0;
      color: #999;
      font-size: 0.9em;
    }
    .emoji {
      font-size: 1.5em;
      margin: 0 5px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="cover">
      <h1>${title}</h1>
      <p class="author">Written by You</p>
      <p class="date">Created on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      <div style="margin-top: 20px;">
        <span class="emoji">⭐</span>
        <span class="emoji">✨</span>
        <span class="emoji">🌟</span>
        <span class="emoji">💫</span>
      </div>
    </div>

    ${characterDrawing ? `
    <div class="illustration">
      <img src="${characterDrawing}" alt="Character illustration">
      <p class="illustration-caption">The Character</p>
    </div>
    ` : ''}

    <div class="story-content">
      ${story.split('\n\n').map(p => `<p>${p}</p>`).join('\n')}
    </div>

    ${settingDrawing ? `
    <div class="illustration">
      <img src="${settingDrawing}" alt="Setting illustration">
      <p class="illustration-caption">The Setting</p>
    </div>
    ` : ''}

    <div class="footer">
      <p><strong>✨ Keep Writing! ✨</strong></p>
      <p>Every story you create makes you a better writer.</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
