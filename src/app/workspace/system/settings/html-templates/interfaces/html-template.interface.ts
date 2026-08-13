export interface HtmlTemplate {
  id: string;
  name: string;
  document_class?: string;
  css?: string;
  header?: string;
  body?: string;
  footer?: string;
  page_footer?: string;
  margin_top?: string;
  margin_bottom?: string;
  margin_left?: string;
  margin_right?: string;
  institution_id?: string;
}

export interface HtmlTemplateTag {
  tag: string;
  description: string;
}
