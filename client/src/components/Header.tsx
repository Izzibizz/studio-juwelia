import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { MenuToggle } from "./MenuToggle";
import { RiEnglishInput } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import logo from "/juwelia-tattoo-logo-2.png";
import textLogo from "/juwelia-logo-1-v.svg";
import Fr from "/Fr.png";
/* import { usePageStore } from "../stores/pageStore"; */

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [smallerHeader, setSmallerHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  const [isEnglish, setIsEnglish] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [mobileLanguageExpanded, setMobileLanguageExpanded] = useState(false);
  const isHome = location.pathname === "/";
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLLIElement>(null);

  const navlinks = [
    { fr: "Tatouage", eng: "Tattoos", path: "/tatouages" },
    { fr: "Oeuvres", eng: "Art", path: "/oeuvres" },
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

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const toggleMobileLanguage = () => {
    setMobileLanguageExpanded(!mobileLanguageExpanded);
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
    const handleResize = () => setIsMobile(window.innerWidth < 1280);

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
      if (
        languageRef.current &&
        event.target instanceof Node &&
        !languageRef.current.contains(event.target)
      ) {
        setLanguageDropdownOpen(false);
        setMobileLanguageExpanded(false);
      }
    };

    if (isOpen || mobileLanguageExpanded) {
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
  }, [isOpen, mobileLanguageExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      if (languageDropdownOpen) {
        setLanguageDropdownOpen(false);
      }
    };

    if (languageDropdownOpen) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [languageDropdownOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-screen font-juwelia flex justify-between p-4 pr-6 tablet:p-6 laptop:pt-8 laptop:pr-8 items-center z-[50]
       text-black  ${scrolled ? "bg-beige/85 h-[80px]" : "bg-none h-[100px]"} animate-fadeIn`}
    >
      <div
        className="flex gap-6 laptop:gap-0 items-center cursor-pointer"
        onClick={() => logoClick()}
      >
        {" "}
        <img
          src={isMobile && smallerHeader ? logo : isMobile ? logo : logo}
          className={` ${
            smallerHeader
              ? "w-[50px] transform transition-transform duration-200"
              : "w-[70px] transform transition-transform duration-200"
          }  ${
            !isHome &&
            "hover:scale-105 transform transition-transform duration-100"
          }`}
          alt="logo Juwelia icon"
        />
        {!isMobile && (
          <img
            src={textLogo}
            className={` ${
              !isHome &&
              "hover:scale-105 transform transition-transform duration-100"
            } ${
              smallerHeader
                ? "w-[100px] transform transition-transform duration-200"
                : "w-[170px] transform transition-transform duration-200"
            }`}
            alt="Studio Juwelia logo text"
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
                className={`fixed top-0 right-0 h-screen w-screen overflow-hidden bg-beige text-xl backdrop-blur-xl flex justify-end px-10 `}
                ref={dropdownRef}
              >
                <ul className="flex flex-col items-end gap-5 text-darkRed absolute bottom-34 tablet:bottom-40 animate-fadeIn">
                  {!isHome && (
                    <NavLink
                      to="/"
                      onClick={closeMenu}
                      className="hover:scale-105 transform transition-transform duration-100"
                    >
                      {formatFrenchOE(isEnglish ? "Home" : "Accueil")}
                    </NavLink>
                  )}
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
                </ul>
                <div className="absolute bottom-10 right-10 flex items-center">
                  <AnimatePresence>
                    {mobileLanguageExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2 mr-2"
                      >
                        <button
                          onClick={() => {
                            setIsEnglish(!isEnglish);
                            setMobileLanguageExpanded(false);
                          }}
                          className="flex items-center gap-2 bg-beige px-3 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
                        >
                          {isEnglish ? (
                            <>
                              <img
                                src={Fr}
                                alt="Français"
                                className="w-5 h-5"
                              />{" "}
                              Français
                            </>
                          ) : (
                            <>
                              <RiEnglishInput /> English
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={toggleMobileLanguage}
                    className="flex items-center gap-2 text-2xl hover:scale-105 transform transition-transform duration-100 min-h-[2rem]"
                  >
                    <span className="flex items-center">
                      {isEnglish ? (
                        <RiEnglishInput />
                      ) : (
                        <img src={Fr} alt="Français" className="w-7 h-7" />
                      )}
                    </span>
                    <AnimatePresence>
                      {mobileLanguageExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-1 text-lg whitespace-nowrap overflow-hidden"
                        >
                          {isEnglish ? "English" : "Français"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
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
            {!isHome && (
              <NavLink
                to="/"
                onClick={closeMenu}
                className="hover:scale-105 hover:text-brown text-2xl transform transition-transform duration-100"
              >
                {formatFrenchOE(isEnglish ? "Home" : "Accueil")}
              </NavLink>
            )}
            {navlinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="hover:scale-105 hover:text-brown text-2xl transform transition-transform duration-100"
              >
                {formatFrenchOE(isEnglish ? link.eng : link.fr)}
              </NavLink>
            ))}
            <li className="relative ml-12" ref={languageRef}>
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center gap-2 hover:scale-105 transform transition-transform duration-100 text-2xl"
              >
                {isEnglish ? <RiEnglishInput /> : <img src={Fr} alt="Français" className="w-7 h-7" />}
                <span className="text-sm">
                  <IoIosArrowDown />
                </span>
              </button>
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-beige border border-gray-300 rounded shadow-lg z-80">
                  <button
                    onClick={() => {
                      setIsEnglish(false);
                      setLanguageDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    <>
                      <img src={Fr} alt="Français" className="w-7 h-7" />{" "}
                      Français
                    </>
                  </button>
                  <button
                    onClick={() => {
                      setIsEnglish(true);
                      setLanguageDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    <RiEnglishInput /> English
                  </button>
                </div>
              )}
            </li>
          </ul>
        </>
      )}
    </header>
  );
};
