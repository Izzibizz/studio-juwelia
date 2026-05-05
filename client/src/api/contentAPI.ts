const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Import auth store for token expiration handling
import { useAuthStore } from "../stores/authStore";

const handleApiResponse = async (res: Response, operation: string) => {
  if (res.status === 401) {
    // Token expired or invalid, trigger logout
    const authStore = useAuthStore.getState();
    authStore.logout();
    authStore.checkTokenExpiration(); // This will show the popup
    throw new Error("Votre session a expiré. Vous avez été déconnecté.");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed ${operation}`);
  }

  return res;
};

export type PlainText = string;
export type RichTextHtml = string;

export interface ImageGalleryItemData {
  image: PlainText;
  alt: PlainText;
  name?: PlainText;
  text?: RichTextHtml;
}

export interface TechniqueCategory {
  title?: PlainText;
  mainImage?: {
    image?: PlainText;
    alt?: PlainText;
    description?: RichTextHtml;
  };
  description?: RichTextHtml;
  contentText?: RichTextHtml;
  images: ImageGalleryItemData[];
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
  title?: PlainText;
  subtitle?: RichTextHtml;
  buttonText?: PlainText;
  successMessage?: PlainText;
  termsAndConditions?: RichTextHtml;
}

export interface TestimonialItem {
  name: PlainText;
  quote: RichTextHtml;
  role: PlainText;
}

export interface TestimonialsSectionData {
  title?: PlainText;
  items: TestimonialItem[];
}

export interface FaqItem {
  question: PlainText;
  answer: RichTextHtml;
}

export interface FaqSectionData {
  title?: PlainText;
  items: FaqItem[];
}

export interface TattoosTechniqueImage {
  image?: PlainText;
  alt?: PlainText;
  text?: RichTextHtml;
}

export interface TattoosTechniqueCategory {
  title?: PlainText;
  mainImage?: {
    image?: PlainText;
    alt?: PlainText;
    description?: RichTextHtml;
  };
  description?: RichTextHtml;
  contentText?: RichTextHtml;
  images?: TattoosTechniqueImage[];
}

export interface ContactPageContent {
  seo?: {
    title?: PlainText;
    description?: RichTextHtml;
  };
  intro?: {
    title?: PlainText;
    description?: RichTextHtml;
    ctaText?: PlainText;
    imageGallery?: ImageGalleryItemData[];
  };
  contactForm?: ContactFormSectionData;
  email?: PlainText;
  phone?: PlainText;
  address?: PlainText;
  instagramName?: PlainText;
  instagramLink?: PlainText;
  testimonials?: TestimonialsSectionData;
  faq?: FaqSectionData;
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

export interface TattoosIntroductionData {
  h2?: PlainText;
  h3?: PlainText;
  description?: RichTextHtml;
  introImage?: PlainText;
  introImageAlt?: PlainText;
  introImageDescription?: RichTextHtml;
}

export interface TattoosTechniquesData {
  h2?: PlainText;
  h3?: PlainText;
  description?: RichTextHtml;
  categories?: TechniqueCategory[];
}

export interface TattoosDetailsData {
  decorImage?: PlainText;
  h2?: PlainText;
  cta?: PlainText;
  h3?: PlainText;
  description?: RichTextHtml;
  contentText?: RichTextHtml;
}

export interface TattoosPageContent {
  introduction?: TattoosIntroductionData;
  techniques?: TattoosTechniquesData;
  details?: TattoosDetailsData;
  contactForm?: ContactFormSectionData;
  testimonials?: TestimonialsSectionData;
  faq?: FaqSectionData;
}

export const defaultTattoosContent: TattoosPageContent = {
  introduction: {
    h2: "",
    h3: "",
    description: "",
    introImage: "",
    introImageAlt: "",
    introImageDescription: "",
  },
  techniques: {
    h2: "",
    h3: "",
    description: "",
    categories: [],
  },
  details: {
    decorImage: "",
    h2: "",
    cta: "",
    h3: "",
    description: "",
    contentText: "",
  },
  contactForm: {
    title: "Book an appointment",
    subtitle: "Laissez-nous un message avec votre projet.",
    buttonText: "Envoyer",
    successMessage: "Merci, votre message a été envoyé.",
    termsAndConditions: "",
  },
  testimonials: {
    title: "Ce que disent nos clients",
    items: [],
  },
  faq: {
    title: "Questions fréquentes",
    items: [],
  },
};

interface PageDataResponse<T = Record<string, unknown>> {
  page: string;
  data: T;
}

interface GalleryAppendResponse {
  page: string;
  section: HomeGallerySectionKey;
  item: ImageGalleryItemData;
  data: Partial<HomePageContent>;
}

export type PageKey =
  | "homepage"
  | "shared"
  | "about"
  | "art"
  | "booking"
  | "contact"
  | "tattoos";

export type HomeGallerySectionKey = "artIntro" | "tattooIntro";

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

const getPageData = async <TData extends object>(
  page: PageKey,
): Promise<TData> => {
  const res = await fetch(`${API_BASE}/page/${page}`);
  await handleApiResponse(res, `loading page ${page}`);
  const json = (await res.json()) as PageDataResponse<TData>;
  return json.data || ({} as TData);
};

export const contentAPI = {
  getHomePageContent: async (): Promise<HomePageContent> => {
    const pageData = await getPageData<Partial<HomePageContent>>("homepage");

    return mergeHomeContent(defaultHomeContent, pageData, {});
  },

  getContactPageContent: async (): Promise<ContactPageContent> => {
    return getPageData<ContactPageContent>("contact");
  },

  getTattoosPageContent: async (): Promise<TattoosPageContent> => {
    const [pageData, homepageData] = await Promise.all([
      getPageData<Partial<TattoosPageContent>>("tattoos"),
      getPageData<Partial<HomePageContent>>("homepage"),
    ]);

    return {
      ...defaultTattoosContent,
      ...pageData,
      contactForm:
        homepageData.contactForm || defaultTattoosContent.contactForm,
      testimonials:
        homepageData.testimonials || defaultTattoosContent.testimonials,
      faq: homepageData.faq || defaultTattoosContent.faq,
    };
  },

  savePageContent: async <TData extends object>(
    page: PageKey,
    data: TData,
    token?: string,
  ): Promise<{ page: string; data: TData }> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/page/${page}`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ data }),
    });

    await handleApiResponse(res, `saving page ${page}`);
    return res.json();
  },

  saveSharedPageContent: async (
    data: Partial<
      Pick<HomePageContent, "contactForm" | "testimonials" | "faq">
    >,
    token?: string,
  ): Promise<{ page: string; data: Partial<HomePageContent> }> => {
    const pageData = await getPageData<Partial<HomePageContent>>("homepage");
    const mergedData = {
      ...pageData,
      ...data,
      contactForm: {
        ...defaultHomeContent.contactForm,
        ...(pageData.contactForm || {}),
        ...(data.contactForm || {}),
      },
      testimonials: {
        ...defaultHomeContent.testimonials,
        ...(pageData.testimonials || {}),
        ...(data.testimonials || {}),
        items:
          data.testimonials?.items ||
          pageData.testimonials?.items ||
          defaultHomeContent.testimonials.items,
      },
      faq: {
        ...defaultHomeContent.faq,
        ...(pageData.faq || {}),
        ...(data.faq || {}),
        items:
          data.faq?.items ||
          pageData.faq?.items ||
          defaultHomeContent.faq.items,
      },
    };

    return contentAPI.savePageContent("homepage", mergedData, token);
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

    await handleApiResponse(res, "uploading images");

    const payload = (await res.json()) as {
      images?: UploadedCloudinaryImage[];
    };
    return payload.images || [];
  },

  addHomepageGalleryImage: async (
    section: HomeGallerySectionKey,
    file: File,
    token?: string,
    options?: { alt?: string; name?: string },
  ): Promise<GalleryAppendResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    if (options?.alt) {
      formData.append("alt", options.alt);
    }

    if (options?.name) {
      formData.append("name", options.name);
    }

    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${API_BASE}/page/homepage/gallery/${section}/add`,
      {
        method: "POST",
        credentials: "include",
        headers,
        body: formData,
      },
    );

    await handleApiResponse(res, `adding image to ${section}`);
    return res.json();
  },

  removeHomepageGalleryImage: async (
    section: HomeGallerySectionKey,
    index: number,
    token?: string,
  ): Promise<{ data: Record<string, unknown> }> => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${API_BASE}/page/homepage/gallery/${section}/${index}`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      },
    );

    await handleApiResponse(res, `removing image from ${section}`);
    return res.json();
  },
};
