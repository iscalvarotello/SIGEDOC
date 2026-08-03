export const LOCAL_ROUTE_KEYS = {
  DOCUMENT_DETAIL: 'DOCUMENT_DETAIL',
  NEW_DOCUMENT: 'NEW_DOCUMENT'
};

export interface LocalRouteConfig {
  path: string; // Puede incluir placeholders con dos puntos (ej. '/operatividad/documento/:id')
}

export const LocalRoutes: Record<string, LocalRouteConfig> = {
  [LOCAL_ROUTE_KEYS.DOCUMENT_DETAIL]: { path: '/operatividad/documento/:id' },
  [LOCAL_ROUTE_KEYS.NEW_DOCUMENT]: { path: '/operatividad/form-new-document/:id' }
};
