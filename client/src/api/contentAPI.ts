const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export type PlainText = string;
export type RichTextHtml = string;

export interface ImageGalleryItemData {
  image: PlainText;
  alt: PlainText;
  name: PlainText;
}

export interface GalleryIntroSectionData {
  title: PlainText;
  description: RichTextHtml;
  ctaText: PlainText;
  imageGallery: ImageGalleryItemData[];
}

export interface HeroSectionData {
  title: PlainText;
  subtitle: RichTextHtml;
  description: RichTextHtml;
  primaryCtaText: PlainText;
  primaryCtaLink: PlainText;
  imageRight: PlainText;
  imageLeft: PlainText;
  poem: RichTextHtml;
}

export interface ValuesIntroItem {
  title: PlainText;
  description: RichTextHtml;
  ctaText: PlainText;
  ctaLink: PlainText;
  illustrationImage: PlainText;
  valuesImage: PlainText;
}

export interface ProfileIntroItem {
  title: PlainText;
  description: RichTextHtml;
  ctaText: PlainText;
  ctaLink: PlainText;
  image: PlainText;
}

export interface AboutIntroData {
  items: Array<ValuesIntroItem | ProfileIntroItem>;
}

export interface ContactFormSectionData {
  title: PlainText;
  subtitle: RichTextHtml;
  buttonText: PlainText;
  successMessage: PlainText;
  termsAndConditions: RichTextHtml;
}

export interface TestimonialItem {
  name: PlainText;
  quote: RichTextHtml;
  role: PlainText;
}

export interface TestimonialsSectionData {
  title: PlainText;
  items: TestimonialItem[];
}

export interface FaqItem {
  question: PlainText;
  answer: RichTextHtml;
}

export interface FaqSectionData {
  title: PlainText;
  items: FaqItem[];
}

export interface HomePageContent {
  hero: HeroSectionData;
  artIntro: GalleryIntroSectionData;
  tattooIntro: GalleryIntroSectionData;
  aboutIntro: AboutIntroData;
  contactForm: ContactFormSectionData;
  testimonials: TestimonialsSectionData;
  faq: FaqSectionData;
}

interface PageDataResponse {
  page: string;
  data: Partial<HomePageContent>;
}

export interface UploadedCloudinaryImage {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  caption: string;
  uploadedAt: string;
}

export const defaultHomeContent: HomePageContent = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    primaryCtaText: "",
    primaryCtaLink: "",
    imageRight: "",
    imageLeft: "",
    poem: "",
  },
  artIntro: {
    title: "",
    description: "",
    ctaText: "",
    imageGallery: [],
  },
  tattooIntro: {
    title: "",
    description: "",
    ctaText: "",
    imageGallery: [],
  },
  aboutIntro: {
    items: [],
  },
  contactForm: {
    title: "",
    subtitle: "",
    buttonText: "",
    successMessage: "",
    termsAndConditions: "",
  },
  testimonials: {
    title: "",
    items: [],
  },
  faq: {
    title: "",
    items: [],
  },
};

const mergeHomeContent = (
  base: HomePageContent,
  pageData?: Partial<HomePageContent>,
  sharedData?: Partial<HomePageContent>,
): HomePageContent => {
  return {
    ...base,
    ...sharedData,
    ...pageData,
    hero: {
      ...base.hero,
      ...(sharedData?.hero || {}),
      ...(pageData?.hero || {}),
    },
    artIntro: {
      ...base.artIntro,
      ...(sharedData?.artIntro || {}),
      ...(pageData?.artIntro || {}),
      imageGallery:
        pageData?.artIntro?.imageGallery ||
        sharedData?.artIntro?.imageGallery ||
        base.artIntro.imageGallery,
    },
    tattooIntro: {
      ...base.tattooIntro,
      ...(sharedData?.tattooIntro || {}),
      ...(pageData?.tattooIntro || {}),
      imageGallery:
        pageData?.tattooIntro?.imageGallery ||
        sharedData?.tattooIntro?.imageGallery ||
        base.tattooIntro.imageGallery,
    },
    aboutIntro: {
      ...base.aboutIntro,
      ...(sharedData?.aboutIntro || {}),
      ...(pageData?.aboutIntro || {}),
      items:
        pageData?.aboutIntro?.items ||
        sharedData?.aboutIntro?.items ||
        base.aboutIntro.items,
    },
    contactForm: {
      ...base.contactForm,
      ...(sharedData?.contactForm || {}),
      ...(pageData?.contactForm || {}),
    },
    testimonials: {
      ...base.testimonials,
      ...(sharedData?.testimonials || {}),
      ...(pageData?.testimonials || {}),
      items:
        pageData?.testimonials?.items ||
        sharedData?.testimonials?.items ||
        base.testimonials.items,
    },
    faq: {
      ...base.faq,
      ...(sharedData?.faq || {}),
      ...(pageData?.faq || {}),
      items: pageData?.faq?.items || sharedData?.faq?.items || base.faq.items,
    },
  };
};

export const contentAPI = {
  getHomePageContent: async (): Promise<HomePageContent> => {
    let pageData: Partial<HomePageContent> = {};
    let sharedData: Partial<HomePageContent> = {};

    const homeRes = await fetch(`${API_BASE}/page/homepage`);
    if (homeRes.ok) {
      const homeJson = (await homeRes.json()) as PageDataResponse;
      pageData = homeJson.data || {};
    }

    const sharedRes = await fetch(`${API_BASE}/page/shared`);
    if (sharedRes.ok) {
      const sharedJson = (await sharedRes.json()) as PageDataResponse;
      sharedData = sharedJson.data || {};
    }

    return mergeHomeContent(defaultHomeContent, pageData, sharedData);
  },

  uploadImages: async (
    files: File[],
    token?: string,
    options?: { alt?: string; caption?: string },
  ): Promise<UploadedCloudinaryImage[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    if (options?.alt) {
      formData.append("alt", options.alt);
    }

    if (options?.caption) {
      formData.append("caption", options.caption);
    }

    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/page/media/upload`, {
      method: "POST",
      credentials: "include",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Image upload failed");
    }

    const payload = (await res.json()) as {
      images?: UploadedCloudinaryImage[];
    };
    return payload.images || [];
  },
};
