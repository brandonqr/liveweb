import JSZip from 'jszip';
import i18n from '../i18n';

/**
 * Download code as a ZIP file
 * @param {string} code - HTML code to include in the ZIP
 * @param {string} filename - Optional custom filename (without .zip extension)
 */
export const downloadCodeAsZip = async (code, filename = null) => {
  try {
    // Create a new JSZip instance
    const zip = new JSZip();

    // Add the HTML code as index.html
    zip.file('index.html', code);

    // Generate the ZIP file as a blob
    const blob = await zip.generateAsync({ type: 'blob' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Set filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = filename 
      ? `${filename}.zip` 
      : `codigo-generado-${timestamp}.zip`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error downloading code as ZIP:', error);
    throw new Error(i18n.t('errors.downloadZip', { message: error.message }));
  }
};
