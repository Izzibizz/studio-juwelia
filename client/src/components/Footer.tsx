import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoLogoInstagram } from "react-icons/io";
import { MdOutlineMailOutline, MdOutlineLocationOn } from "react-icons/md";
import { contentAPI, type ContactPageContent } from "../api/contentAPI";

export const Footer: React.FC = () => {
  const location = useLocation();
  const isContactPage = location.pathname === "/contact";
  const [contactInfo, setContactInfo] = useState<ContactPageContent | null>(
    null,
  );

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await contentAPI.getContactPageContent();
        setContactInfo(data);
      } catch (error) {
        console.error("Failed loading contact information:", error);
      }
    };

    loadContactInfo();
  }, []);

  const instagramName = contactInfo?.instagramName?.trim() || "@studiojuwelia";
  const instagramLink =
    contactInfo?.instagramLink?.trim() ||
    (contactInfo?.instagramName
      ? `https://www.instagram.com/${contactInfo.instagramName.replace(/^@/, "")}`
      : "https://www.instagram.com/studiojuwelia");
  const email = contactInfo?.email?.trim() || "contact@studiojuwelia.com";
  const address = contactInfo?.address?.trim() || "Paris, France";

  return (
    <footer className="bg-beige text-black py-8">
      {!isContactPage && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-lg">
          <a
            href={instagramLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-darkRed"
          >
            <IoLogoInstagram />
            {instagramName}
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:text-darkRed"
          >
            <MdOutlineMailOutline />
            {email}
          </a>
          <div className="flex items-center gap-2 text-center text-base text-darkRed">
            <MdOutlineLocationOn />
            {address}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-gray-700">
        &copy; 2026 Studio Juwelia
      </p>
    </footer>
  );
};
