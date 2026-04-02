import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { MenuToggle } from "./MenuToggle";
import { useAuthStore } from "../stores/authStore";
import logo from "/Juwelia.jpg";
import textLogo from "/studio-juwelia-tattoo-name-2.svg";
/* import { usePageStore } from "../stores/pageStore"; */

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [smallerHeader, setSmallerHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const isHome = location.pathname === "/";
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /*   const { isEnglish } = usePageStore()  */
  const isEnglish = false;

  const { user, isAuthenticated, logout } = useAuthStore();

  const navlinks = [
    { fr: "Tatouage", eng: "Tattoos", path: "/tatouages" },
    { fr: "Oeuvres", eng: "Art", path: "/oevres" },
    { fr: "A propos", eng: "About", path: "/a-propos" },
    { fr: "Contact", eng: "Contact", path: "/contact" },
    {
      fr: "Prendre rendez-vous",
      eng: "Book appointment",
      path: "/prendre-rendez-vous",
    },
  ];

  const logoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const [scrolled, setScrolled] = useState(false);

  const formatFrenchOE = (text: string) => {
    return text.split(/(oe)/gi).map((part, i) => {
      if (part.toLowerCase() === "oe") {
        return (
          <span key={i} className="oe-pair">
            <span className="oe-o">o</span>
            <span className="oe-e">e</span>
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // ändra tröskel om du vill
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSmallerHeader(true);
      } else {
        setSmallerHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1025);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target) &&
        !(buttonRef.current && buttonRef.current.contains(event.target))
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-screen font-juwelia flex justify-between p-4 pr-6 tablet:p-6 laptop:px-8 items-center z-70
       text-black  ${scrolled ? "bg-red-500" : "bg-none"} animate-fadeIn`}
    >
      <div
        className="flex gap-6 items-center cursor-pointer"
        onClick={() => logoClick()}
      >
        {" "}
        <img
          src={isMobile && smallerHeader ? logo : isMobile ? logo : logo}
          className={` ${
            smallerHeader
              ? "w-[60px] transform transition-transform duration-200"
              : "w-[100px] transform transition-transform duration-200"
          }  ${
            !isHome &&
            "hover:scale-105 transform transition-transform duration-100"
          }`}
          alt="logo Juwelia"
        />
        {!isMobile && (
          <img
            src={textLogo}
            className={`w-[150px] ${
              !isHome &&
              "hover:scale-105 transform transition-transform duration-100"
            }`}
            alt="hagsätra collective"
          />
        )}
      </div>
      {isMobile ? (
        <>
          <MenuToggle isOpen={isOpen} toggleMenu={toggleMenu} ref={buttonRef} />
          <AnimatePresence>
            {isOpen && isMobile && (
              <motion.div
                initial={{ clipPath: "circle(5% at 100% 0%)" }}
                animate={{ clipPath: "circle(150% at 50% 50%)" }}
                exit={{ clipPath: "circle(5% at 100% 0%)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`fixed top-0 right-0 h-screen w-screen overflow-hidden bg-lightRed text-xl backdrop-blur-xl flex justify-end px-10 `}
                ref={dropdownRef}
              >
                <ul className="flex flex-col items-end gap-5 text-darkRed absolute bottom-28 tablet:bottom-40 animate-fadeIn">
                  {navlinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={closeMenu}
                      className="hover:scale-105 transform transition-transform duration-100"
                    >
                      {formatFrenchOE(isEnglish ? link.eng : link.fr)}
                    </NavLink>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <div className="border-t border-darkRed w-full pt-5 mt-5 text-center">
                        <p className="text-sm mb-3">Welcome, {user?.name}</p>
                        <button
                          onClick={async () => {
                            await logout();
                            closeMenu();
                            navigate("/");
                          }}
                          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : null}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <>
          <ul
            className={`flex gap-10 pr-6 text-lg items-center
            `}
          >
            {navlinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="hover:scale-105 hover:text-white text-2xl transform transition-transform duration-100"
              >
                {formatFrenchOE(isEnglish ? link.eng : link.fr)}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : null}
          </ul>
        </>
      )}
    </header>
  );
};
