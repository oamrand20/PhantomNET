import Head from "next/head";
import Link from "next/link";
import { BiHome } from "react-icons/bi";

function AdminPage() {
  return (
    <>
      <Head>
        <title>Victims</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <section className="sm:px-10 min-h-screen sm:mt-2 md:mt-5 mb-3 pt-3">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          sorry, this page is not ready yet
        </h1>
        {/* Logout Button */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <BiHome className="mr-2" />
            Home
          </Link>
        </div>
      </section>
    </>
  );
}
export default AdminPage;
