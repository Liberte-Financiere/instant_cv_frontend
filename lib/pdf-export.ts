// Native browser print solution - no dependencies required

export interface ExportOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

const defaultOptions: ExportOptions = {
  filename: 'cv',
  format: 'a4',
  orientation: 'portrait',
  quality: 2,
};

/**
 * Export a DOM element to PDF using browser print
 * This method is more reliable than html2canvas for modern CSS
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const opts = { ...defaultOptions, ...options };
  
  return new Promise((resolve, reject) => {
    try {
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const iframeWindow = iframe.contentWindow;
      const iframeDocument = iframe.contentDocument || iframeWindow?.document;
      
      if (!iframeDocument || !iframeWindow) {
        throw new Error('Could not create iframe');
      }

      // Clone all stylesheets
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');

      // Write the document
      iframeDocument.open();
      iframeDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${opts.filename}</title>
            <style>
              ${styles}
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              
              @page {
                size: A4;
                margin: 0;
              }
              
              @media print {
                body {
                  width: 210mm;
                  min-height: 297mm;
                }
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `);
      iframeDocument.close();

      // Wait for content to load then print
      setTimeout(() => {
        try {
          iframeWindow.focus();
          iframeWindow.print();
          
          // Clean up after a short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
            resolve();
          }, 1000);
        } catch (err) {
          document.body.removeChild(iframe);
          reject(err);
        }
      }, 500);

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Direct PDF generation using jsPDF (simple text-based)
 * Fallback option that always works
 */
export function exportToSimplePDF(
  element: HTMLElement,
  options: ExportOptions = {}
): void {
  const opts = { ...defaultOptions, ...options };
  
  // Use browser's native print dialog which creates PDF
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    // Fallback: direct print
    window.print();
    return;
  }

  // Clone styles
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${opts.filename}</title>
        <style>
          ${styles}
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

/**
 * Print the CV using browser print dialog
 */
export function printCV(element: HTMLElement): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup blocked. Please allow popups for printing.');
    return;
  }

  // Clone styles from the original document
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('');
      } catch {
        // Cross-origin stylesheets will throw
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV</title>
        <style>
          ${styles}
          @media print {
            body { 
              margin: 0; 
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page { 
              margin: 0; 
              size: A4;
            }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}
