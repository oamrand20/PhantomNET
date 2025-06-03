import { useEffect, useState } from "react";
import Head from "next/head";
import { ar, enUS } from "../../../translation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const qa = [
  {
    question: "What is PhantomNet?",
    answer:
      "PhantomNet is a next-generation command and control server designed for ethical hacking and red team operations, leveraging machine learning to enhance security testing.",
  },

  {
    question: "Is PhantomNet suitable for beginners?",
    answer:
      "Yes, PhantomNet is designed to be user-friendly, with comprehensive documentation and tutorials to help beginners get started with ethical hacking and security testing.",
  },
  {
    question: "What are the system requirements for PhantomNet?",
    answer:
      "PhantomNet requires a modern operating system (Linux or Windows), at least 8GB of RAM, and a multi-core processor for optimal performance.",
  },
  {
    question: "Can PhantomNet be used for commercial purposes?",
    answer:
      "Yes, PhantomNet can be used for commercial purposes, but users must comply with the licensing terms and conditions provided by the developers.",
  },
  {
    question: "How can I contribute to PhantomNet?",
    answer:
      "Contributions to PhantomNet are welcome! You can contribute by reporting bugs, suggesting features, or submitting code improvements through our GitHub repository.",
  },
  {
    question: "Where can I find support for PhantomNet?",
    answer:
      "Support for PhantomNet is available through our community forums, documentation, and GitHub issues page. We also have a dedicated support team for premium users.",
  },
  {
    question: "Is there a mobile version of PhantomNet?",
    answer:
      "Currently, PhantomNet is primarily designed for desktop use. However, we are exploring options for mobile compatibility in future releases.",
  },
  {
    question: "What security measures does PhantomNet implement?",
    answer:
      "PhantomNet implements various security measures, including encryption, access controls, and regular updates to protect against vulnerabilities and ensure secure operations.",
  },
  {
    question: "How can I stay updated with PhantomNet developments?",
    answer:
      "You can stay updated with PhantomNet developments by following our official blog, subscribing to our newsletter, and joining our community on social media platforms.",
  },
  {
    question: "Can I customize PhantomNet for my specific needs?",
    answer:
      "Yes, PhantomNet is highly customizable. Users can modify configurations, add plugins, and integrate with other tools to tailor the platform to their specific requirements.",
  },
  {
    question: "What is the licensing model for PhantomNet?",
    answer:
      "PhantomNet is available under a dual licensing model, offering both an open-source version and a commercial license for enterprises requiring additional features and support.",
  },
  {
    question: "How do I report a bug in PhantomNet?",
    answer:
      "To report a bug in PhantomNet, please visit our GitHub repository and submit an issue with detailed information about the problem you encountered.",
  },
  {
    question: "Are there any tutorials available for PhantomNet?",
    answer:
      "Yes, we provide a range of tutorials and documentation on our website to help users get started with PhantomNet and make the most of its features.",
  },
  {
    question: "What is the community like around PhantomNet?",
    answer:
      "The PhantomNet community is active and supportive, with users sharing knowledge, tips, and experiences through forums, social media, and community events.",
  },
  {
    question: "How can I integrate PhantomNet with other security tools?",
    answer:
      "PhantomNet supports integration with various security tools through APIs and plugins, allowing users to enhance their security workflows and capabilities.",
  },
  {
    question: "What are the future plans for PhantomNet?",
    answer:
      "Future plans for PhantomNet include expanding its machine learning capabilities, enhancing user experience, and adding more features based on community feedback.",
  },
  {
    question: "Can PhantomNet be used for penetration testing?",
    answer:
      "Yes, PhantomNet is designed to assist in penetration testing by providing tools and features that help identify vulnerabilities and assess security posture.",
  },
  {
    question: "How do I get started with PhantomNet?",
    answer:
      "To get started with PhantomNet, you can download the latest version from our website, follow the installation guide, and explore the documentation for setup instructions.",
  },
  {
    question: "What is the best way to learn PhantomNet?",
    answer:
      "The best way to learn PhantomNet is through hands-on practice, following our tutorials, participating in community discussions, and experimenting with its features.",
  },
  {
    question: "Does PhantomNet support multi-language?",
    answer:
      "Yes, PhantomNet supports multiple languages, allowing users from different regions to use the platform in their preferred language.",
  },
  {
    question: "How can I provide feedback on PhantomNet?",
    answer:
      "We welcome feedback from users! You can provide feedback through our community forums, social media channels, or by submitting an issue on our GitHub repository.",
  },
];
function AdminPage() {
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter QA based on search query
  const filteredQA = qa.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Show all items when search is empty

    return (
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  if (isLoading == false) {
    return (
      <>
        <Head>
          <title>Admin Page</title>
          <link rel="icon" href="/logo.ico" />
        </Head>
        <section className="sm:px-10 min-h-screen mb-3 pt-28">
          {/* QA */}
          {/* Search section to filter the questions */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions and answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredQA.length > 0 &&
              filteredQA.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  {/* Gradient accent line */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="p-6 pl-8">
                    {/* Question */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        Q
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-relaxed">
                        {item.question}
                      </h3>
                    </div>

                    {/* Answer */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        A
                      </div>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.064 2.379l-.129.109A7.962 7.962 0 014 15a8.001 8.001 0 0116 0 7.962 7.962 0 01-1.807 2.488l-.129-.109z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.no_results_found}
                </h3>
                <p className="text-gray-600 mb-6">{t.contact_us_for_help}</p>
                <button
                  onClick={() =>
                    window.open(
                      "mailto:netphantom6@gmail.com?subject=Question about PhantomNet",
                      "_blank"
                    )
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t.sendEmail}
                </button>
              </div>
            </div>
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
