import { Link } from "react-router";
import Chatbot from "./components/Chatbot";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <Outlet />
      </main>
      <Chatbot />
    </>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full py-3 md:py-4 px-2 bg-black/90 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src="./logo.svg" alt="Logo" className="w-32 md:w-50" />
          </Link>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <Link to="/search" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold text-sm md:text-base">
            검색
          </Link>
          <Link to="/My Page" className="text-white hover:text-amber-100 transition-colors duration-300 font-bold text-sm md:text-base">
            My page
          </Link>
          <Link to="/login" className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-bold transition-colors duration-300 text-sm md:text-base">
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}