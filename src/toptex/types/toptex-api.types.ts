// ─── Toptex API response types ────────────────────────────────────────────────

export interface ToptexTranslations {
  en?: string;
  fr?: string;
  de?: string;
  nl?: string;
  es?: string;
  it?: string;
  pt?: string;
}

export interface ToptexPrice {
  quantity: number;
  price: string;
}

export interface ToptexSize {
  sku: string;
  ean?: string;
  barCode?: string;
  size?: string;
  sizeCode?: string;
  prices?: ToptexPrice[];
  publicUnitPrice?: string;
  unitsPerBox?: number;
  unitsPerPack?: number;
  isNew?: boolean | number;
  isDiscontinued?: boolean | number;
  saleState?: string;
}

export interface ToptexPackshotData {
  image_id?: string | number;
  url_image?: string;
  url?: string;
  last_update?: string;
}

export interface ToptexColor {
  colorCode?: string;
  colorsHexa?: string[];
  colorsPantone?: string[];
  colorsRGB?: string[];
  colorsCMYK?: string[];
  colors?: ToptexTranslations;
  saleState?: string;
  lastChange?: string;
  sizes?: ToptexSize[];
  packshots?: Record<string, ToptexPackshotData>;
}

export interface ToptexImage {
  image_id?: string | number;
  url_image?: string;
  url?: string;
  last_update?: string;
}

export interface ToptexProduct {
  catalogReference: string;
  brand?: string;
  averageWeight?: number;
  gender?: ToptexTranslations | string | string[];
  labelType?: string;
  organic?: string | boolean;
  recycled?: string | boolean;
  vegan?: string | boolean;
  oekoTex?: string | boolean;
  saleState?: string;
  lastChange?: string;
  createdDate?: string;
  designation?: ToptexTranslations;
  description?: ToptexTranslations;
  composition?: ToptexTranslations;
  mainMaterials?: ToptexTranslations;
  family?: ToptexTranslations;
  sub_family?: ToptexTranslations | null;
  images?: ToptexImage[];
  colors?: ToptexColor[];
}

export interface ToptexPageResponse {
  items: ToptexProduct[];
  total_count: number;
}

export interface ToptexDeletedItem {
  catalog_id: string; // e.g. "B050_77310_S"
  catalog_type: string; // "size" | "color" | "product"
  deleted_at?: string;
}

export interface ToptexDeletedPageResponse {
  items: ToptexDeletedItem[];
  total_count: number;
}
