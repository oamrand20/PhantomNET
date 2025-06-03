import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function Login() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  const language = useSelector((state: RootState) => state.language.value);
  const [t, setT] = useState(language === 0 ? enUS : ar);

  useEffect(() => {
    const lang = localStorage.getItem("nepShopLang");
    setT(lang === "1" ? ar : enUS);
  }, [language]);

  const [message, setMessage] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const cart = useSelector((state: RootState) => state.basket.items);

  const validatePhone = (value: string) => {
    const isValid = /^07[789][0-9]{7}$/.test(value);
    setPhoneValid(isValid);
    return isValid;
  };

  const validatePassword = (value: string) => {
    const isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
    setPasswordValid(isValid);
    return isValid;
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const phone = e.target[0].value;
    const password = e.target[1].value;

    if (validatePhone(phone) && validatePassword(password)) {
      const result = await signIn("credentials", {
        phone,
        password,
        redirect: false,
      });

      if (result?.ok) {
        setMessage("");
      } else {
        setMessage(t.invalidCredential);
      }
    } else {
      setMessage(t.invalidCredential);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4"
      dir={t === enUS ? "ltr" : "rtl"}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <Image
            src="/home-bg.avif"
            alt="Login illustration"
            width={200}
            height={200}
            className="mx-auto rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {t.loginToYourAcc}
          </h1>
          <p className="text-gray-500">{t.welcomBack}</p>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              {t.phone}
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="phone"
                name="phone"
                className={`block w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 ${
                  phoneValid
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="07xxxxxxxxx"
                onChange={(e) => validatePhone(e.target.value)}
              />
              <div className="absolute top-3 right-3 text-lg">
                {phoneValid ? (
                  <AiOutlineCheck className="text-green-500" />
                ) : (
                  <AiOutlineClose className="text-gray-300" />
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t.password}
            </label>
            <div className="mt-1 relative">
              <input
                type="password"
                id="password"
                name="password"
                className={`block w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 ${
                  passwordValid
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="••••••••"
                onChange={(e) => validatePassword(e.target.value)}
              />
              <div className="absolute top-3 right-3 text-lg">
                {passwordValid ? (
                  <AiOutlineCheck className="text-green-500" />
                ) : (
                  <AiOutlineClose className="text-gray-300" />
                )}
              </div>
            </div>
          </div>

          {message && (
            <p className="text-sm text-red-600 text-center">{message}</p>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              phoneValid && passwordValid
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!(phoneValid && passwordValid)}
          >
            {t.login}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
