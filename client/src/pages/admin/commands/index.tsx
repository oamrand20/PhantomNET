import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import { useSession } from "next-auth/react";
function couponsControl() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [page, setPage] = useState(1);
  const [number, setNumber] = useState<number>(1);
  const [pageSearch, setPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [coupons, setCoupons] = useState({
    data: ["Array", " Array"],
    current_page: 0,
    per_page: 0,
    total: 0,
  });
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [categories, setCategories] = useState<any>([]);
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
    if (!searching) {
      setIsLoading(true);
      const url = `${db_link}/api/codes?page=${page}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setCoupons(res.data.coupons);
          setCategories(res.data.categories);
          setIsLoading(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [page, number, db_link]);
  useEffect(() => {
    if (db_link === "") return;
    if (searching) {
      const value = searchInput;
      setIsLoading(true);
      const url = `${db_link}/api/search/codes?page=${pageSearch}`;
      axios
        .post(
          url,
          { value },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        )
        .then((res) => {
          setCoupons(res.data.coupons);
          setCategories(res.data.categories);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [pageSearch, db_link]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearching(true);
    const value = e.target[0].value;
    setSearchInput(e.target[0].value);
    setIsLoading(true);
    const url = `${db_link}/api/search/codes?page=${page}`;
    axios
      .post(
        url,
        { value },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      )
      .then((res) => {
        setCoupons(res.data.coupons);
        setCategories(res.data.categories);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    if (searching) {
      setPageSearch(selectedItem.selected + 1);
    } else {
      setPage(selectedItem.selected + 1);
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [backError, setBackError] = useState<any>(false);
  const [message, setMessage] = useState<any>(false);
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("name", e.target[0].value);
    fData.append("code", e.target[1].value);
    fData.append("description", e.target[2].value);
    fData.append("category_id", e.target[3].value);

    axios
      .post(`${db_link}/api/code/add`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setBackError(res.data.errors);
          setMessage(false);
          window.scroll(0, document.body.scrollHeight + 20);
        } else {
          setBackError(false);
          if (t == enUS) {
            setMessage("added successfully");
          } else {
            setMessage("تم الإضافة بنجاح");
          }
          window.scroll(0, 0);
          e.target.reset();
          setNumber(number + 1);
        }
      });
  };
  const deleteHandler = (id: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      axios
        .delete(`${db_link}/api/code/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then(() => {
          setNumber(number + 1);
        })
        .catch(() => {
          alert("Error deleting Command");
        });
    }
  };
  return (
    <section
      className="sm:px-10 sm:mt-2 md:mt-5"
      dir={t == enUS ? "ltr" : "rtl"}
    >
      <div>
        {/* heading section */}
        <div className="flex sm:justify-between sm:flex-row gap-5 my-4 mx-2 flex-col justify-center items-center">
          <div>
            <h1 className="text-xl font-bold text-main-color">
              {t.commandTable}
            </h1>
          </div>
          <form
            onSubmit={handleSearch}
            className="border flex h-fit w-fit rounded overflow-hidden"
          >
            <input
              type="text"
              name="search"
              placeholder={t == enUS ? "Virus" : "فايروس"}
              className="h-8 p-2 w-40 bg-gray-100 outline-none focus:bg-gray-200 transition-all"
            />
            <button
              type="submit"
              className="h-8 w-10 text-gray-500 hover:text-gray-600 hover:bg-gray-300 transition-all bg-gray-200 flex justify-center items-center"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        {/* add coupon successfully */}
        {message && (
          <p className=" w-full bg-green-100 text-center p-2 my-5 rounded">
            {message}
          </p>
        )}
        {/* table section */}
        <div className="overflow-x-scroll overflow-y-hidden w-full">
          <table className="w-full">
            <thead className="border-b-2 w-full">
              <tr>
                <th>Id</th>
                <th>{t.name}</th>
                <th>{t.command}</th>
                <th>{t.description}</th>
                <th>{t.category}</th>
                <th>{t.delete}</th>
              </tr>
            </thead>
            {!isLoading ? (
              <tbody className="w-full">
                {coupons.data.map((coupon: any, i: number) => {
                  return (
                    <tr
                      key={coupon.id}
                      className={`hover:bg-gray-200 transition-all mb-2 ${
                        i % 2 == 0 && "bg-gray-100"
                      }`}
                    >
                      <td className="px-2  text-center p-3">{coupon.id}</td>

                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.name}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.code}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.description.length > 35
                          ? coupon.description.slice(0, 35) + "..."
                          : coupon.description}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {categories.map((cat: any) => {
                          if (cat.id == coupon.category_id) {
                            return cat.name;
                          }
                        })}
                      </td>
                      <td className="px-2 py-3 flex justify-center">
                        <button
                          onClick={() => deleteHandler(coupon.id)}
                          className="text-white bg-red-500 hover:bg-red-400 px-2 py-1 rounded-lg transition-all text-lg"
                        >
                          {t.delete}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <div className="relative h-80 w-screen ">
                <div
                  className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-10 h-10 border-t-4  border-main-color rounded-full"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
              </div>
            )}
          </table>
        </div>
        {/* pagination section */}
        <div>
          <ReactPaginate
            pageCount={Math.ceil(coupons.total / 25)}
            previousLabel="<"
            nextLabel=">"
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>

        {/* add coupon form section */}
        <div className="border-t mt-4 pt-3">
          <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2">
            {t.addCommand}{" "}
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                } else {
                  setShowForm(true);
                }
              }}
              className={`bg-main-color p-1 rounded-full text-white ${
                showForm ? "rotate-180" : "rotate-0"
              } transition-all hover:bg-secondary-color`}
            >
              <IoIosArrowDown />
            </button>
          </h2>
          {showForm && (
            <form
              onSubmit={submitHandler}
              className="flex flex-col gap-4 w-full md:w-1/2 items-center sm:items-start sm:rtl:items-end mb-2"
            >
              <div className="flex flex-col gap-2 px-2 w-full">
                <label htmlFor="name" className="text-xl w-fit">
                  {t.name}
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  id="name"
                  placeholder={"Logic Bomb"}
                  className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2 px-2 w-full">
                <label htmlFor="code" className="text-xl w-fit">
                  {t.command}
                </label>
                <input
                  required
                  type="text"
                  name="code"
                  id="code"
                  placeholder={"logic_bomb"}
                  className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2 px-2 w-full">
                <label htmlFor="description" className="text-xl w-fit">
                  {t.description}
                </label>
                <input
                  required
                  type="text"
                  name="description"
                  id="description"
                  placeholder={
                    "This is a logic bomb that will delete all files"
                  }
                  className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                />
              </div>
              <div className="flex flex-col gap-2 px-2 w-full">
                <label htmlFor="category" className="text-xl w-fit">
                  {t.category}
                </label>
                <select
                  name="category"
                  id="category"
                  className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                >
                  {categories.map((cat: any) => {
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex justify-center sm:justify-start gap-8 px-2 pb-4 w-full">
                <button
                  type="submit"
                  disabled={requestSent ? true : false}
                  className={`transition-all text-gray-200 rounded px-10 py-2 font-bold bg-main-color`}
                >
                  {t.addCommand}
                </button>
              </div>

              <ul className="w-full">
                {backError &&
                  backError.map((error: any, index: number) => {
                    return (
                      <li className="text-red-500" key={index}>
                        - {error}
                      </li>
                    );
                  })}
              </ul>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default couponsControl;
