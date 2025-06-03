import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useSession } from "next-auth/react";
function Profile() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const categoryId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [categoryData, setCategoryData] = useState<any>("");
  const [message, setMessage] = useState<any>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    if (db_link === "") return;
    axios
      .get(`${db_link}/api/files/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        const data = res.data[0];
        setCategoryData(data);
        setName(data.name);
        setDescription(data.description);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // router.push("/");
      });
  }, [categoryId, db_link]);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const areYouSureHandler = () => {
    if (confirm(t.areYouSureToDeleteCategory)) {
      axios
        .delete(`${db_link}/api/files/delete/${categoryId}`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then(() => {
          router.push("/admin/category");
        })
        .catch(() => {
          setMessage(t.somethingWentWrong);
        });
    }
  };
  return (
    <>
      <Head>
        <title>File-{categoryId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5">
        <div>
          {loading ? (
            "loading"
          ) : (
            <>
              {/* message */}
              {message == t.theDataUpdated && (
                <p className="w-full bg-green-400/40 rounded text-center py-2 my-2">
                  {message}
                </p>
              )}
              {message == t.somethingWentWrong && (
                <p className="w-full bg-red-400/40 rounded text-center py-2 my-2">
                  {message}
                </p>
              )}
              {/* category details */}
              <div className="flex flex-col-reverse items-center text-center sm:text-start sm:flex-row sm:justify-between gap-5">
                <div className="basis-1/2">
                  <h1 className="text-3xl mb-3">
                    <Link
                      href={"/admin/category"}
                      className="text-main-color hover:text-secondary-color"
                    >
                      Category
                    </Link>
                    : {categoryData.name}
                  </h1>
                  <p className="text-secondary-text mb-2">
                    Name: {categoryData.name}
                  </p>
                  <p className="text-secondary-text mb-2">
                    Description: {categoryData.description}
                  </p>
                </div>
              </div>
              {/* preview the file */}
              <Link
                href={`https://gray-cassowary-688759.hostingersite.com/img/files/${categoryData.name}`}
                className="w-full flex justify-center items-center gap-2 bg-main-color text-white p-2 rounded mb-4"
                target="_blank"
              >
                Go To File
              </Link>
              {/* --delete category section-- */}
              <div
                className="border-t mt-4 pt-3"
                dir={t == enUS ? "ltr" : "rtl"}
              >
                <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2 ltr:font-rorboto rtl:font-notoKufi">
                  {t.delete}{" "}
                  <button
                    onClick={() => {
                      if (showDelete) {
                        setShowDelete(false);
                      } else {
                        setShowDelete(true);
                      }
                    }}
                    className={`bg-red-500 p-1 rounded-full text-white ${
                      showDelete ? "rotate-180" : "rotate-0"
                    } transition-all hover:bg-red-400`}
                  >
                    <IoIosArrowDown />
                  </button>
                </h2>
                {showDelete && (
                  <p>
                    <button
                      onClick={areYouSureHandler}
                      className="bg-red-500 text-white p-2 rounded ltr:font-rorboto rtl:font-notoKufi"
                    >
                      {t.delete}
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Profile;
