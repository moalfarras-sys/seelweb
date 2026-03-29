export type GalleryCategory =
  | "umzug"
  | "reinigung"
  | "entruempelung"
  | "gewerbe"
  | "express";

export type GalleryItem = {
  id: string;
  title: string;
  alt: string;
  imageUrl: string;
  storagePath?: string | null;
  category: GalleryCategory;
  sortOrder: number;
  isVisible: boolean;
  showOnHomepage: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TrustItem = {
  id: string;
  label: string;
};

export type PublicSiteContent = {
  company: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    legalRepresentative: string;
    vatId: string;
    taxNo: string;
    registerCourt: string;
    registerNo: string;
  };
  contact: {
    primaryPhone: string;
    primaryPhoneDisplay: string;
    secondaryPhone: string;
    secondaryPhoneDisplay: string;
    email: string;
    whatsappNumber: string;
    websiteUrl: string;
    websiteDisplay: string;
    availability: string;
    serviceRegion: string;
  };
  bank: {
    name: string;
    iban: string;
    bic: string;
    accountHolder: string;
  };
  homepage: {
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    finalCtaTitle: string;
    finalCtaDescription: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryDescription: string;
  };
  trustBar: TrustItem[];
  whyChooseUs: string[];
};

export type SiteContentData = {
  settings: PublicSiteContent;
  galleryItems: GalleryItem[];
};
