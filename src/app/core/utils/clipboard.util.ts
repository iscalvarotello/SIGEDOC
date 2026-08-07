export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.error('Clipboard API failed', e);
      return fallbackCopyTextToClipboard(text);
    }
  } else {
    return fallbackCopyTextToClipboard(text);
  }
};

const fallbackCopyTextToClipboard = (text: string): boolean => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.error('Fallback copy failed', err);
    document.body.removeChild(textArea);
  }
  
  // Si todo falla, abrimos un prompt para que el usuario copie manualmente
  window.prompt('Copia manual requerida (bloqueado por falta de HTTPS). Presiona Ctrl+C / Cmd+C y luego Enter:', text);
  return true;
};

