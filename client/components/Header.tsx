import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BiBasket,
  BiBox,
  BiCurrentLocation,
  BiMessage,
  BiScreenshot,
  BiSearchAlt,
} from "react-icons/bi";
import { BsCart, BsGrid, BsUiRadiosGrid } from "react-icons/bs";
import { TfiWorld } from "react-icons/tfi";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { initializeBasket } from "../src/slice/basketSlice";
import { initializeApi } from "../src/slice/apiSlice";
import { ar, enUS } from "../translation";
import { changeToArabic, changeToEnglish } from "../src/slice/langSlice";
import {
  FaBox,
  FaTruck,
  FaUserAlt,
  FaUserTimes,
  FaHistory,
  FaUsers,
  FaCoins,
  FaChalkboard,
  FaList,
  FaStar,
  FaCodepen,
  FaMoneyBill,
  FaHeart,
} from "react-icons/fa";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { GiChickenOven } from "react-icons/gi";
import { motion } from "framer-motion";
function Header() {
  const { db_link, nameAr, name } = useSelector(
    (state: RootState) => state.apiData
  );
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const basketTotal = useSelector((state: RootState) => state.basket.total);
  const [isLoading, setIsLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const language = useSelector((state: RootState) => state.language.value);
  const dispatch = useDispatch();
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { data: session, status } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<
    "account" | "language" | "adminMenu" | null
  >(null);
  useEffect(() => {
    dispatch(
      initializeApi({
        id: 1,
        db_link: "https://gray-cassowary-688759.hostingersite.com",
        name: "PhantomNet",
        nameAr: "فانتوم نت",
      })
    );
  }, [router.pathname]);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const showLangHandler = () => {
    if (showLang == false) {
      setShowLang(true);
    } else {
      setShowLang(false);
    }
  };
  const languageToArabic = () => {
    dispatch(changeToArabic());
    showLangHandler();
    tHandler(ar);
  };
  const languageToEnglish = () => {
    dispatch(changeToEnglish());
    showLangHandler();
    tHandler(enUS);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);
  // state
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header dir={t == enUS ? "ltr" : "rtl"} className="top-0 z-10">
      {session?.user.role == 0 ? (
        <>
          <div className="w-full z-20 bg-main-color px-4 sm:px-10 md:px-20 lg:px-32 py-1 flex md:gap-4  justify-between rtl:flex-row-reverse">
            {/* logo */}
            <div
              className="cursor-pointer flex rtl:flex-row-reverse"
              onClick={() => router.push("/admin")}
            >
              <Link
                href={"/admin"}
                className="text-2xl font-bold text-white py-2 hover:scale-105 transition-all"
              >
                PhantomNet
              </Link>
            </div>
            {/* links */}
            <div className="flex rtl:flex-row-reverse items-center justify-end  dark:text-black-text text-white-text">
              <ul className="flex rtl:flex-row-reverse gap-6 sm:gap-5 md:gap-6 lg:gap-7 justify-end items-center">
                {/* drop menu */}
                <li className="relative">
                  <p
                    className="transition cursor-pointer text-white relative hover:text-gray-200 flex items-center gap-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaList className="text-lg" />
                    <span className="font-medium">{t.allLinks}</span>
                  </p>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl pb-2 pt-8 z-50 transform transition-all duration-200 ease-in-out border border-gray-100">
                      <button
                        className="font-bold text-xl absolute top-2 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(false);
                        }}
                      >
                        ✕
                      </button>
                      <Link
                        href="/admin/orders"
                        onClick={() => setShowDropdown(false)}
                        className="sm:hidden flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaBox className="text-lg mr-3" />
                        <span>{t.orders}</span>
                      </Link>
                      <Link
                        href="/admin/products"
                        onClick={() => setShowDropdown(false)}
                        className="sm:hidden flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <BiBasket className="text-lg mr-3" />
                        <span>{t.products}</span>
                      </Link>
                      <Link
                        href="/admin/users"
                        onClick={() => setShowDropdown(false)}
                        className="sm:hidden flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaUsers className="text-lg mr-3" />
                        <span>{t.users}</span>
                      </Link>
                      <Link
                        href="/admin/category"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaList className="text-lg mr-3" />
                        <span>{t.category}</span>
                      </Link>

                      <Link
                        href="/admin/payments"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaMoneyBill className="text-lg mr-3" />
                        <span>{t.payments}</span>
                      </Link>

                      <Link
                        href="/admin/messages"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <BiMessage className="text-lg mr-3" />
                        <span>{t.messages}</span>
                      </Link>
                      <Link
                        href="/admin/history"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaHistory className="text-lg mr-3" />
                        <span>{t.history}</span>
                      </Link>
                    </div>
                  )}
                </li>
                <li className="relative dropdown-container z-30">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "language" ? null : "language"
                      )
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      activeDropdown === "language"
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <TfiWorld className="text-lg text-white" />
                    <span className="text-sm text-white font-bold">
                      {t.language}
                    </span>
                    <IoIosArrowDown
                      className={`transition-transform text-white ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                      <div className="p-3 bg-gray-50 border-b">
                        <p className="text-sm font-medium text-gray-700">
                          {t.selectLanguage}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={languageToArabic}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="arabic flag"
                            width={24}
                            height={24}
                            src="/languages/arabicLang.svg"
                          />
                          <div className="text-left">
                            <p className="font-medium">العربية</p>
                            <p className="text-xs text-gray-500">Arabic (Ar)</p>
                          </div>
                        </button>

                        <button
                          onClick={languageToEnglish}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="english flag"
                            width={24}
                            height={24}
                            src="/languages/englishLang.webp"
                          />
                          <div className="text-left">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-gray-500">
                              English (En)
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : session?.user.role == 1 ? (
        <>
          <div className="w-full z-20 bg-main-color px-4 sm:px-10 md:px-20 lg:px-32 py-1 flex md:gap-4  justify-between rtl:flex-row-reverse">
            {/* logo */}
            <div
              className="cursor-pointer flex rtl:flex-row-reverse"
              onClick={() => router.push("/admin")}
            >
              <Link
                href={"/admin"}
                className="text-2xl font-bold text-white py-2 hover:scale-105 transition-all"
              >
                PhantomNet
              </Link>
            </div>
            {/* links */}
            <div className="flex rtl:flex-row-reverse items-center justify-end  dark:text-black-text text-white-text">
              <ul className="flex rtl:flex-row-reverse gap-6 sm:gap-5 md:gap-6 lg:gap-7 justify-end items-center">
                {/* drop menu */}
                <li className="relative">
                  <p
                    className="transition cursor-pointer text-white relative hover:text-gray-200 flex items-center gap-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaList className="text-lg" />
                    <span className="font-medium">{t.allLinks}</span>
                  </p>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl pb-2 pt-8 z-50 transform transition-all duration-200 ease-in-out border border-gray-100">
                      <button
                        className="font-bold text-xl absolute top-2 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(false);
                        }}
                      >
                        ✕
                      </button>
                      <Link
                        href="/admin/orders"
                        onClick={() => setShowDropdown(false)}
                        className="sm:hidden flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaBox className="text-lg mr-3" />
                        <span>{t.orders}</span>
                      </Link>
                      <Link
                        href="/admin/products"
                        onClick={() => setShowDropdown(false)}
                        className="sm:hidden flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <BiBasket className="text-lg mr-3" />
                        <span>{t.products}</span>
                      </Link>
                      <Link
                        href="/admin/category"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaList className="text-lg mr-3" />
                        <span>{t.category}</span>
                      </Link>

                      <Link
                        href="/admin/messages"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <BiMessage className="text-lg mr-3" />
                        <span>{t.messages}</span>
                      </Link>
                    </div>
                  )}
                </li>
                <li className="relative dropdown-container z-30">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "language" ? null : "language"
                      )
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      activeDropdown === "language"
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <TfiWorld className="text-lg text-white" />
                    <span className="text-sm text-white font-bold">
                      {t.language}
                    </span>
                    <IoIosArrowDown
                      className={`transition-transform text-white ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                      <div className="p-3 bg-gray-50 border-b">
                        <p className="text-sm font-medium text-gray-700">
                          {t.selectLanguage}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={languageToArabic}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="arabic flag"
                            width={24}
                            height={24}
                            src="/languages/arabicLang.svg"
                          />
                          <div className="text-left">
                            <p className="font-medium">العربية</p>
                            <p className="text-xs text-gray-500">Arabic (Ar)</p>
                          </div>
                        </button>

                        <button
                          onClick={languageToEnglish}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="english flag"
                            width={24}
                            height={24}
                            src="/languages/englishLang.webp"
                          />
                          <div className="text-left">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-gray-500">
                              English (En)
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <nav className=" to-black text-white px-4 py-5 bg-black/50 backdrop-blur-md fixed w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <Link href={"/"} className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/20"
                    aria-hidden="true"
                  >
                    <span className="text-xl font-bold">Pn</span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight hidden sm:block">
                    PhantomNet
                  </h2>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="relative dropdown-container">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "language" ? null : "language"
                      )
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      activeDropdown === "language"
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <TfiWorld className="text-lg" />
                    <span className="text-sm font-medium">{t.language}</span>
                    <IoIosArrowDown
                      className={`transition-transform ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                      <div className="p-3 bg-gray-50 border-b">
                        <p className="text-sm font-medium text-gray-700">
                          {t.selectLanguage}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={languageToArabic}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="arabic flag"
                            width={24}
                            height={24}
                            src="/languages/arabicLang.svg"
                          />
                          <div className="text-left">
                            <p className="font-medium">العربية</p>
                            <p className="text-xs text-gray-500">Arabic (Ar)</p>
                          </div>
                        </button>

                        <button
                          onClick={languageToEnglish}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="english flag"
                            width={24}
                            height={24}
                            src="/languages/englishLang.webp"
                          />
                          <div className="text-left">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-gray-500">
                              English (En)
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => signIn()}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                  {t.login}
                </button>
              </motion.div>
            </div>
          </nav>
        </>
      )}
      {/* top nav */}
    </header>
  );
}

export default Header;
