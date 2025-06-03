import Link from "next/link";
import { useEffect, useState } from "react";
import { BiEnvelopeOpen, BiPaperPlane } from "react-icons/bi";
import { FaDiscord, FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";

function Footer() {
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  return (
    <footer
      dir={t == enUS ? "ltr" : "rtl"}
      className="text-white bg-gradient-to-r from-gray-900 to-black border-t border-purple-800 py-12"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/20"
                aria-hidden="true"
              >
                <span className="text-xl font-bold">Pn</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">PhantomNet</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.copyright} © {new Date().getFullYear()} PhantomNet.{" "}
              {t.all_rights_reserved}.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-left md:text-right">
              <div>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm font-medium block py-1"
                  aria-label="Terms of service"
                >
                  {t.terms}
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm font-medium block py-1"
                  aria-label="Privacy policy"
                >
                  {t.privacy}
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm font-medium block py-1"
                  aria-label="Documentation"
                >
                  {t.documentation}
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-xs order-2 md:order-1">
              {t.footer_tagline}
            </p>

            <nav aria-label="Social media links" className="order-1 md:order-2">
              <ul className="flex  gap-4">
                <li className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <FaGithub className="w-5 h-5" />
                </li>
                <li className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <FaFacebook className="w-5 h-5" />
                </li>
                <li className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <FaInstagram className="w-5 h-5" />
                </li>
                <li className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  <FaDiscord className="w-5 h-5" />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
