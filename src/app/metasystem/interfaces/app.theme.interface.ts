export interface ThemeGenericBubble {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

/**
 * Interfaz que dicta la estructura completa de un Tema dinámico.
 * El Metasistema define qué constituye un tema (colores, tamaños, burbujas base),
 * y el Workspace consume estas variables en su lógica de negocio.
 */
export interface ThemeDefinition {
  // Identidad Principal
  colors: {
    primary: string;
    secondary: string;
    background: string;
    logo?: string;
    
    // Semánticos
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  
  // Tipografía y Tamaños Base
  typography: {
    titleSize: string;     // ej. '2.25rem' o 'text-4xl'
    subtitleSize: string;  // ej. '1.5rem'
    normalSize: string;    // ej. '1rem'
    buttonSize: string;    // ej. '0.875rem'
  };

  // Componentes Genéricos de la UI del Tema
  ui: {
    success_bubble: ThemeGenericBubble;
    warning_bubble: ThemeGenericBubble;
    info_bubble: ThemeGenericBubble;
  };
}
