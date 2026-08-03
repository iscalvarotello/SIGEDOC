export type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  value?: number;
  subItems?: { module_id: number; name: string; path: string; pro?: boolean; new?: boolean, value?: number; }[];
};

export type MenuSection = {
  title: string;
  prefix: string;
  items: NavItem[];
};
