import { useEffect, useState } from "react";
import { AboutIntro } from "../components/home/AboutIntro";
import { ArtIntro } from "../components/home/ArtIntro";
import { ContactFormSection } from "../components/home/ContactFormSection";
import { FAQSection } from "../components/home/FAQSection";
import { Hero } from "../components/home/Hero";
import { TattooIntro } from "../components/home/TattooIntro";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { contentAPI, defaultHomeContent } from "../api/contentAPI";
import type { HomePageContent } from "../api/contentAPI";

export const HomePage: React.FC = () => {
  const [content, setContent] = useState<HomePageContent>(defaultHomeContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await contentAPI.getHomePageContent();
        setContent(data);
      } catch (error) {
        console.error("Failed loading homepage content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-brown">Chargement du contenu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 space-y-8">
      <Hero data={content.hero} />

      <div className="grid md:grid-cols-3 gap-4">
        <ArtIntro data={content.artIntro} />
        <TattooIntro data={content.tattooIntro} />
        <AboutIntro data={content.aboutIntro} />
      </div>

      <TestimonialsSection data={content.testimonials} />
      <ContactFormSection data={content.contactForm} />
      <FAQSection data={content.faq} />
    </div>
  );
};
