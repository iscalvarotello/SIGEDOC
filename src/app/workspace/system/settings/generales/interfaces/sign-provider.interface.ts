export interface SignProviderCredentials {
  apiUser?: string;
  apiPassword?: string;
  [key: string]: any;
}

export interface SignProvider {
  id: string;
  name: string;
  code: string;
  api_url: string;
  auth_endpoint: string;
  sign_endpoint: string;
  credentials: SignProviderCredentials;
  xml_template: string;
  created_at: string;
}

export interface SignatureSettings {
  id: string;
  offset_y: number;
  margin_x: number;
  active_provider_id: string | null;
  active_provider?: SignProvider;
  legend_footnote?: string;
  legend_acuse?: string;
}
