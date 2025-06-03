import { useEffect, useState } from "react";
import Head from "next/head";
import { ar, enUS } from "../../translation";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Home = () => {
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);

  useEffect(() => {
    // Language preference handling
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);

  return (
    <>
      <Head>
        <title>PhantomNet</title>
        <meta
          name="description"
          content="Next-generation command and control server using machine learning for ethical hacking and red team operations"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        dir={t == enUS ? "ltr" : "rtl"}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      >
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                PhantomNet
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                {t.advanced} C2 {t.framework}
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                {t.revolutionize} {t.your} {t.ethical} {t.hacking} {t.and}{" "}
                {t.penetration} {t.testing} {t.with} {t.our} {t.cutting_edge} .
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => signIn()}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-3 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                  {t.login}
                </button>
                <Link
                  href={"/qa"}
                  className="px-6 py-3 rounded-lg border border-purple-500 text-white font-semibold hover:bg-purple-500/10 transition-all duration-300"
                >
                  {t.learn_more}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="md:w-1/2 w-full relative"
            >
              <div dir="ltr" className="w-full h-96 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-2xl backdrop-blur-sm border border-white/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-black/50 rounded-xl p-4 overflow-hidden border border-purple-500/30">
                    <div className="h-6 flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="ml-4 text-xs text-gray-400">
                        phantom@net:~
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                      className="text-green-400 font-mono text-sm"
                    >
                      <p>&gt; Initializing PhantomNet C2 Server...</p>
                      <p className="mt-2">&gt; Loading API...</p>
                      <p className="mt-2">
                        &gt; Establishing secure connections...
                      </p>
                      <p className="mt-2">
                        &gt; System ready. Welcome, operator.
                      </p>
                      <div className="mt-2 flex items-center">
                        <span>&gt;</span>
                        <span className="ml-2 w-2 h-5 bg-green-400 animate-pulse"></span>
                      </div>
                    </motion.div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-600/30 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-600/30 rounded-full blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-16"
          >
            {t.why} PhantomNet?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: t.advancedTech,
                description: t.advancedTechDesc,
              },
              {
                icon: "🛡️",
                title: t.advanced_evasion,
                description: t.advanced_evasion_desc,
              },
              {
                icon: "📊",
                title: t.comprehensive_reporting,
                description: t.comprehensive_reporting_desc,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description || "Feature description"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-white/10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t.ready_to_elevate}
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.join_professionals}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  signIn();
                }}
                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                {t.get_started}
              </button>
              <Link
                href={"/qa"}
                className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white/10 transition-colors duration-300"
              >
                {t.contact_us}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
