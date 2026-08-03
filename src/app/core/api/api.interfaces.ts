export interface RouteDef {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
  plain?: boolean;
  raw?: boolean;
}

export interface ApiPackageConfig {
  base: string;
  plain?: boolean;
  frontendMapping?: Record<string, string | string[]>;
  specialRoutes?: Record<string, RouteDef>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DBResponse<T> {
  data: T;
  meta?: PaginationMeta;
}
