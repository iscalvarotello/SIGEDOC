export interface HtmlTemplate {
  id?: string;
  institutionId: string;
  document_class: string;
  page_size?: string;
  css?: string;
  header_page?: string;
  body_text?: string;
  footer_page?: string;
  margin_top?: number;
  margin_bottom?: number;
  margin_left?: number;
  margin_right?: number;
  font_family?: string;
  font_size?: string;
  line_height?: string;
  paragraph_spacing?: string;
}

export interface HtmlTemplateTag {
  tag: string;
  description: string;
}
