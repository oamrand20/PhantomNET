import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import { BiLogOut, BiMessage } from "react-icons/bi";
import axios from "axios";
import {
  FaHistory,
  FaIcons,
  FaUserEdit,
  FaMoneyCheck,
  FaLaptopCode,
  FaKeyboard,
  FaFile,
} from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IoReload } from "react-icons/io5";
import { ar, enUS } from "../../../translation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { AiFillMacCommand } from "react-icons/ai";
import { BsFile, BsFileBinary, BsFileSlides } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
const CACHE_KEY = "adminData";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

interface CachedData {
  data: any;
  timestamp: number;
}

function getCachedData(): CachedData | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  return JSON.parse(cached);
}

function AdminPage() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>("");

  const fetchData = async () => {
    if (db_link === "") return;
    if (!session?.user?.token) return;

    setIsLoading(true);
    const url = `${db_link}/api/adminData`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      if (res.data === "you are not allowed here") {
        signOut();
        // router.push("/");

        return;
      }

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: res.data,
          timestamp: Date.now(),
        })
      );

      setData(res.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  useEffect(() => {
    if (db_link === "") return;
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    if (session.user.role == 1 || session.user.role == 0) {
      const cached = getCachedData();
      const now = Date.now();

      // Check if we have valid cached data
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const url = `${db_link}/api/adminData`;
      const token = session.user.token;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data == "you are not allowed here") {
            signOut();
            // router.push("/");
          }

          // Cache the new data
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: res.data,
              timestamp: Date.now(),
            })
          );

          setData(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          signOut();
        });
    }
  }, [status, db_link]);
  if (isLoading == false && status == "authenticated") {
    return (
      <>
        <Head>
          <title>Admin Page</title>
          <link rel="icon" href="/logo.ico" />
        </Head>
        <section className="sm:px-10 min-h-screen sm:mt-2 md:mt-5 mb-3 pt-3">
          {/* welcoming section */}
          <div className="relative mb-8">
            {/* Background Gradient Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl transform -skew-y-2"></div>

            {/* Main Content Container */}
            <div className="relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              {/* Welcome Section */}
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-white transform group-hover:scale-105 transition duration-300">
                    <span className="text-xl font-bold text-blue-600">
                      {session.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium">
                    {t.welcomBack}
                  </span>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {session.user.name}
                  </h1>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-gray-100">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem(CACHE_KEY);
                    fetchData();
                  }}
                  className="relative group bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative px-4 py-2 bg-white rounded-full group-hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2">
                    <IoReload className="w-4 h-4 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                      {t.refreshData}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                icon: FaKeyboard,
                label: "CLI",
                path: "/admin/cli",
              },
              {
                icon: FaHistory,
                label: "History",
                path: "/admin/history",
              },
              {
                icon: FaUserEdit,
                label: "Users",
                path: "/admin/users",
              },
              {
                icon: FaIcons,
                label: "Category",
                path: "/admin/category",
              },
              // {
              //   icon: FaMoneyCheck,
              //   label: "Payments",
              //   path: "/admin/payments",
              // },
              {
                icon: AiFillMacCommand,
                label: "Commands",
                path: "/admin/commands",
              },
              // {
              //   icon: FaLaptopCode,
              //   label: "Victims",
              //   path: "/admin/victims",
              // },
              {
                icon: FaFile,
                label: "Files",
                path: "/admin/files",
              },
              {
                icon: TfiEmail,
                label: "Emails",
                path: "/admin/emails",
              },
              {
                icon: BiMessage,
                label: "Q&A",
                path: "/admin/qa",
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
              >
                <div className="p-6 flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors duration-200">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                    {item.label}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-b-xl" />
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="text-center mt-5">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to logout?")) {
                  signOut();
                }
              }}
              className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <BiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <div className="w-full h-screen flex flex-col gap-4 justify-center items-center bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }
}
export default AdminPage;
