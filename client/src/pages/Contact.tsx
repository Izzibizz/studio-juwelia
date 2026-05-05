import { useEffect, useState } from "react";
import { IoLogoInstagram } from "react-icons/io";
import { MdOutlineMailOutline, MdOutlineLocationOn } from "react-icons/md";
import { contentAPI, type ContactPageContent } from "../api/contentAPI";

const defaultContactData: ContactPageContent = {
  email: "contact@studiojuwelia.com",
  instagramName: "@studiojuwelia",
  instagramLink: "https://www.instagram.com/studiojuwelia",
  address: "Paris, France",
};

export const Contact: React.FC = () => {
  const [contactData, setContactData] =
    useState<ContactPageContent>(defaultContactData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await contentAPI.getContactPageContent();
        setContactData({ ...defaultContactData, ...data });
      } catch (error) {
        console.error("Failed loading contact page content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactData();
  }, []);

  const mapSource = contactData.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        contactData.address,
      )}&output=embed`
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-darkBrown">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold">
          {contactData.intro?.title || "Contact"}
        </h1>
        <div
          className="prose max-w-none text-lg leading-8"
          dangerouslySetInnerHTML={{
            __html:
              contactData.intro?.description ||
              "<p>Contact us to book your next tattoo or ask any questions.</p>",
          }}
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-[#e7dfd5] bg-[#f8f4ee] p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <a
              href={contactData.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-xl font-medium text-darkRed hover:text-brown"
            >
              <IoLogoInstagram />
              {contactData.instagramName}
            </a>
            <a
              href={`mailto:${contactData.email}`}
              className="flex items-center gap-3 text-xl font-medium text-darkRed hover:text-brown"
            >
              <MdOutlineMailOutline />
              {contactData.email}
            </a>
            {contactData.phone && (
              <div className="flex items-center gap-3 text-xl font-medium text-darkRed">
                <span className="font-semibold">Phone:</span>
                <span>{contactData.phone}</span>
              </div>
            )}
            <div className="flex items-start gap-3 text-xl font-medium text-darkRed">
              <MdOutlineLocationOn className="mt-1" />
              <span>{contactData.address}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#e7dfd5] bg-[#fff8f0] p-6 shadow-sm">
          {isLoading ? (
            <p className="text-center text-lg text-darkBrown">Loading map…</p>
          ) : contactData.address ? (
            <iframe
              title="Studio Juwelia location"
              src={mapSource}
              className="h-96 w-full rounded-3xl border border-gray-200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-96 items-center justify-center text-center text-lg text-darkBrown">
              Adresse introuvable. Ajoutez une adresse dans le backend pour
              afficher la carte.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
